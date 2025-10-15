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
// export default function checkWifiAccess(req, res, next) {
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

// const clientIp =
//   (req.headers['x-forwarded-for'] ||
//    req.connection.remoteAddress ||
//    req.socket.remoteAddress || '')
//   .replace('::ffff:', '');

// if (clientIp.startsWith('192.168.1.')) {
//   next(); // office Wi-Fi se hai
// } else {
//   return res.status(403).json({ success: false, message: '⚠️ Connect to Office Wi-Fi' });
// }

// }






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




// middleware/checkWifiAccess.js
// export default function checkWifiAccess(req, res, next) {
//   const clientIp =
//     (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || '')
//       .replace('::ffff:', ''); // IPv6 to IPv4

//   console.log('Client IP:', clientIp);

//   // ✅ Allowed IP range
//   const allowedRange = /^192\.168\.1\./; // 192.168.1.x

//   if (!allowedRange.test(clientIp)) {
//     return res.status(403).json({ message: 'Access denied. Connect to office Wi-Fi.' });
//   }

//   next();
// }




// middleware/checkWifiAccess.js
// export default function checkWifiAccess(req, res, next) {
//   const clientIp =
//     (req.headers["x-forwarded-for"] ||
//       req.connection?.remoteAddress ||
//       req.socket?.remoteAddress ||
//       "")
//       .replace("::ffff:", ""); // IPv6 → IPv4

//   console.log("Client IP:", clientIp);

//   // ✅ Sirf 192.168.1.x (office Wi-Fi) range allow karo
//   if (clientIp.startsWith("192.168.1.") || clientIp === "127.0.0.1") {
//     return next();
//   } else {
//     return res.status(403).json({
//       message: "Access denied — Please connect to office Wi-Fi",
//       yourIP: clientIp,
//     });
//   }
// }



// middleware/checkOfficeWiFi.js
export default function checkWifiAccess(req, res, next) {
  const nodeEnv = process.env.NODE_ENV || "development";
  const allowedPublicIPs = process.env.ALLOWED_IPS?.split(",") || []; // Live office public IPs

  let clientIp =
    req.headers["x-forwarded-for"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    "";
  clientIp = clientIp.replace("::ffff:", "").split(",")[0].trim();

  console.log("🌐 Client IP:", clientIp, "| Mode:", nodeEnv);

  if (nodeEnv === "development") {
    if (clientIp.startsWith("192.168.1.") || clientIp === "127.0.0.1") {
      return next(); // Local Wi-Fi OK
    } else {
      return res.status(403).json({
        success: false,
        message: "⚠️ Connect to office Wi-Fi (local).",
        yourIP: clientIp
      });
    }
  } else {
    if (allowedPublicIPs.includes(clientIp)) {
      return next(); // Live office public IP OK
    } else {
      return res.status(403).json({
        success: false,
        message: "⚠️ Connect to office Wi-Fi (live).",
        yourIP: clientIp
      });
    }
  }
}

