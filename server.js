const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// TaskU BackEnd: Express App Configuration
app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(
	session({
		secret: 'OrelGuYuval',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve(__dirname, 'public')));
} else {
	const corsOptions = {
		origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
		credentials: true,
	};
	app.use(cors(corsOptions));
}

const authRoutes = require('./api/auth/auth-routes');
const userRoutes = require('./api/user/user-routes');
const connectSockets = require('./api/socket/socket.routes')
const boardRoutes = require('./api/board/board-routes')

// TaskU BackEnd: routes;
app.use('/api/board', boardRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
connectSockets(io)

app.get('/**', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// const logger = require('./services/logger.service');
const port = process.env.PORT || 3030;
http.listen(port, () => {
	// logger.info('TaskU BackEnd server is running on port: ' + port);
	console.log(`the server running in port ${port}`);
});
