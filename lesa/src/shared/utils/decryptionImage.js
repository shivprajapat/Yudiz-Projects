import crypto from 'crypto'

export const decryptURl = (string) => {
  const CRYPTO_KEY = 'ArtentikFirst@6684'
  const iv = crypto.createHash('sha256').update(CRYPTO_KEY).digest()

  const key = crypto.createHash('sha256').update(CRYPTO_KEY).digest()

  const resizedIV = Buffer.allocUnsafe(16)
  iv.copy(resizedIV)

  const decipher = crypto.createDecipheriv('aes256', key, resizedIV)
  const decrypted = decipher.update(string, 'hex', 'utf8')
  // decrypted += decipher.final('utf8');
  return decrypted
}
