//<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js" integrity="sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
//<script src="https://jeffkitson-music.github.io/js/pygasc.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/fernet@0.4.0/fernetBrowser.min.js"></script>

function getKeyFromPassword(password, salt) {
  //4096 iterations is fast, 480000 is new standard but takes time...
  var keyRaw = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 480000,
    hasher: CryptoJS.algo.SHA256
  })
  var keyHex = CryptoJS.enc.Hex.stringify(keyRaw)
  var fernetKey = hexToBase64(keyHex)
  return fernetKey
}

// https://stackoverflow.com/questions/23190056/hex-to-base64-converter-for-javascript
function hexToBase64(hexstring) {
  return btoa(hexstring.match(/\w{2}/g).map(function(a) {
    return String.fromCharCode(parseInt(a, 16));
  }).join(""));
}

var pw = getKeyFromPassword("yourmom", "goestocollege")
var correct = "p7dNmWQg4QQDw1TlgudCXodPSxCl6EPpHlauT3Hb544="
console.log(pw)
console.log(correct)
console.log(pw == correct)

var ciphertext = "gAAAAABljs5B4286jCXgwhXOJt_-JHRj-cFDYTh_Y-g-cyocgUU1VHnXZsceUhcJgPY86uW9Xq1GqAxtv-d7nsRLH-Ymoym7d4RGaU5p3F2VsfK1E2_5VIUgGE4Crczs_dubTHZ3KPs-wZz9iEgpMfyEyxtCerxo1Q=="
var secret = new fernet.Secret(pw);
var token = new fernet.Token({
  secret: secret,
  token: ciphertext,
  ttl: 0
})
var cleartext = token.decode();
console.log(cleartext)
console.log("Blocking test...")
