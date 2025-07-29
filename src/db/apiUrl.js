import supabase, { supabaseUrl } from './supbase';

export async function getUrl(user_id) {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .eq('user_id', user_id);

  if (error) {
    throw new Error('Unable to load URLs');
  }
  return data;
}
export async function deleteUrl(id) {
  const { data, error } = await supabase.from('urls').delete().eq('id', id);

  if (error) {
    throw new Error('Unable to load URLs');
  }
  return data;
}

export async function createUrl(
  { title, longUrl, customUrl, user_id },
  qrcode
) {
  const short_url = Math.random().toString(36).substring(2, 8);
  const fileName = `qr-${short_url}`;
  const { error: storageError } = await supabase.storage
    .from('qrs')
    .upload(fileName, qrcode);
  if (storageError) throw new Error(error.message);

  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

  const { data, error } = await supabase
    .from('urls')
    .insert([
      {
        title,
        original_url: longUrl,
        custom_url: customUrl || null,
        user_id,
        short_url,
        qr,
      },
    ])
    .select();
  if (error) throw new Error('Error creating a short URL');

  return data;
}

export async function getLongUrl(id) {
  let { data: shortLinkData, error: shortLinkError } = await supabase
    .from('urls')
    .select('id, original_url')
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (shortLinkError && shortLinkError.code !== 'PGRST116') {
    console.error('Error fetching short link:', shortLinkError);
    return;
  }

  return shortLinkData;
}
