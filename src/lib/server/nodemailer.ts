import nodemailer from 'nodemailer';

export default nodemailer.createTransport({
  service: 'gmail',
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
    type: 'login',
		user: 't0ng.k.dev@gmail.com',
		pass: 'yudr psgw edry ydkx'
	}
});
