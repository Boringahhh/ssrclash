const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

config.outbounds.map(i => {
  if (['✋ Manual'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['🇭🇰 Hong Kong'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /港|hk|hongkong|hong kong|🇭🇰/i))
  }
  if (['🇨🇳 Taiwan'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /台|tw|taiwan|🇹🇼/i))
  }
  if (['🇯🇵 Japan'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /日本|jp|japan|🇯🇵/i))
  }
  if (['🇸🇬 Singapore'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:us)).*(新|sg|singapore|🇸🇬)/i))
  }
  if (['🇺🇸 USA'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /美|us|unitedstates|united states|🇺🇸/i))
  }
  if (['🇰🇷 Korea'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /韩国|KR|KOR|Korea|korea|KOREA|🇰🇷/i))
  }
  if (['🇪🇺 Europe'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /(🇩🇪|德国|\bDE\b|germany|🇫🇷|法国|\bFR\b|france|🇮🇹|意大利|\bIT\b|italy|🇪🇸|西班牙|\bES\b|spain|🇬🇧|英国|\bUK\b|united\s?kingdom)/i))
  }
  if (['🇹🇷 Turkey'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /(🇹🇷|土耳其|\bTR\b|\bTUR\b|turkey)/i))
  }
  if (['🇺🇳 Others'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^((?!(🇭🇰|港|hk|🇸🇬|新加坡|sg|🇨🇳|台|tw|🇯🇵|jp|🇺🇸|us|🇰🇷|kr|DIRECT)).)*$/i))
  }
  if (['💠 Backup'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2)

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}