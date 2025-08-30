-- Configuração do Storage para imagens de itens
-- Execute este SQL no SQL Editor do Supabase

-- 1. Criar o bucket 'items' (faça isso manualmente no painel do Supabase)
-- Vá para Storage > New Bucket
-- Nome: items
-- Public bucket: ✅ (marcado)
-- File size limit: 5MB
-- Allowed MIME types: image/*

-- 2. Políticas para o bucket 'items'

-- Política para permitir upload de imagens por usuários autenticados
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'items' 
  AND auth.role() = 'authenticated'
  AND (storage.extension(name)) = ANY(ARRAY['jpg', 'jpeg', 'png', 'gif', 'webp'])
);

-- Política para permitir visualização pública das imagens
CREATE POLICY "Allow public viewing of images" ON storage.objects
FOR SELECT USING (bucket_id = 'items');

-- Política para permitir usuários atualizarem suas próprias imagens
CREATE POLICY "Allow users to update own images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'items' 
  AND auth.role() = 'authenticated'
);

-- Política para permitir usuários deletarem suas próprias imagens
CREATE POLICY "Allow users to delete own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'items' 
  AND auth.role() = 'authenticated'
);

-- 3. Função para limpar imagens órfãs (opcional)
CREATE OR REPLACE FUNCTION cleanup_orphaned_images()
RETURNS void AS $$
BEGIN
  -- Remove imagens que não estão sendo usadas em nenhum item
  DELETE FROM storage.objects 
  WHERE bucket_id = 'items' 
  AND name NOT IN (
    SELECT DISTINCT unnest(images) 
    FROM orders 
    WHERE images IS NOT NULL AND array_length(images, 1) > 0
  );
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger para limpar imagens quando um item é deletado (opcional)
CREATE OR REPLACE FUNCTION cleanup_images_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Remove as imagens do storage quando o item é deletado
  IF OLD.images IS NOT NULL AND array_length(OLD.images, 1) > 0 THEN
    DELETE FROM storage.objects 
    WHERE bucket_id = 'items' 
    AND name = ANY(OLD.images);
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Criar o trigger
CREATE TRIGGER cleanup_images_trigger
  BEFORE DELETE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_images_on_delete();

-- 5. Exemplo de como usar no código:
/*
// Upload de imagem
const { data, error } = await supabase.storage
  .from('items')
  .upload('nome-unico.jpg', file)

// Obter URL pública
const { data: { publicUrl } } = supabase.storage
  .from('items')
  .getPublicUrl('nome-unico.jpg')

// Deletar imagem
const { error } = await supabase.storage
  .from('items')
  .remove(['nome-unico.jpg'])
*/
