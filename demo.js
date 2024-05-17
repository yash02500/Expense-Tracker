// const http = require('http');
// const nodemailer = require("nodemailer");

// // Create a server object
// const server = http.createServer((req, res) => {
//   // Your server should handle requests and responses here
//   res.end('Server is running'); // End the response
// });

// // Transporter configuration should be outside of the server callback
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   port: 465,
//   secure: true, // Use `true` for port 465, `false` for all other ports
//   auth: {
//     user: "tech1organisation@gmail.com",
//     pass: "iial geqy qohs bqih",
//   },
// });

// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: '"Tech1" <tech1organisation@gmail.com>', // sender address
//     to: "diamondbeauty7777@gmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
// }

// // Call the main function and handle errors
// main().catch(console.error);

// // The server should listen on a port
// server.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
