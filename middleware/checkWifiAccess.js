// // middleware/checkWifiAccess.js
// export default function checkWifiAccess(req, res, next) {
//   const clientIp =
//     (req.headers["x-forwarded-for"] ||
//       req.connection.remoteAddress ||
//       req.socket.remoteAddress ||
//       "").replace("::ffff:", ""); // convert IPv6 to IPv4

//   console.log("Client IP:", clientIp);

//   // ✅ Office Wi-Fi ka IP range check (192.168.1.x)
//   if (clientIp.startsWith("192.168.1.")) {
//     next(); // allow login
//   } else {
//     return res.status(403).json({
//       success: false,
//       message: "⚠️ Please connect to Office Wi-Fi to login",
//     });
//   }
// }
// middleware/checkWifiAccess.js
export default function checkWifiAccess(req, res, next) {
//   // agar behind proxy hai to app.set('trust proxy', true') set karein (server file me)
//   const rawIp =
//     req.headers['x-forwarded-for'] ||
//     req.connection.remoteAddress ||
//     req.socket.remoteAddress ||
//     '';

//   const clientIp = rawIp.replace('::ffff:', '').split(',')[0].trim(); // multiple proxies ka case
//   console.log('Client IP:', clientIp);

//   // agar aap sirf ONE exact device (router IP) allow karna chahte ho:
//   if (clientIp === '192.168.1.11' || clientIp.startsWith('192.168.1.11')) {
//     return next();
//   }

//   return res.status(403).json({
//     success: false,
//     message: '⚠️ Please connect to Office Wi-Fi to login',
//   });

const clientIp =
  (req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress || '')
  .replace('::ffff:', '');

if (clientIp.startsWith('192.168.1.')) {
  next(); // office Wi-Fi se hai
} else {
  return res.status(403).json({ success: false, message: '⚠️ Connect to Office Wi-Fi' });
}

}




// // middleware/checkWifiAccess.js
// export default function checkWifiAccess(req, res, next) {
//   const ipRaw = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.socket?.remoteAddress || '';
//   const clientIp = (ipRaw + '').replace('::ffff:', '');

//   console.log('[checkWifiAccess] clientIpRaw:', ipRaw, 'parsed:', clientIp);

//   // === change this to your office device ip or subnet ===
//   // You told: ipv4 address of office device is 192.168.1.11.
//   // If you want to allow whole subnet use '192.168.1.' prefix.
//   const allowedSingleIp = '192.168.1.11';
//   const allowedPrefix = '192.168.1.'; // allow entire Wi-Fi subnet if you prefer

//   if (clientIp === allowedSingleIp || clientIp.startsWith(allowedPrefix)) {
//     console.log('[checkWifiAccess] Access allowed for IP:', clientIp);
//     return next();
//   }

//   console.log('[checkWifiAccess] Access DENIED for IP:', clientIp);
//   return res.status(403).json({
//     success: false,
//     message: '⚠️ Please connect to Office Wi-Fi (192.168.1.x) to login',
//     clientIp: clientIp || null
//   });
// }
