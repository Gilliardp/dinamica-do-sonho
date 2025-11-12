const express = require('express');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Session for admin login (simple password-based)
app.use(session({
  secret: process.env.SESSION_SECRET || 'change_this_in_prod',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

const STOCK_FILE = path.join(__dirname, 'stock.json');
if(!fs.existsSync(STOCK_FILE)){
  const initial = [
    { id:1, title:'Tapete Industrial - Exemplo', price:'150€', image:'/images/stock-1.jpg', desc:'Tapete resistente, ideal para áreas de passagem.'},
    { id:2, title:'Tapete Persa - Exemplo', price:'980€', image:'/images/stock-2.jpg', desc:'Peça artesanal persa feita à mão.'},
    { id:3, title:'Tapete Oriental - Exemplo', price:'420€', image:'/images/stock-3.jpg', desc:'Tapete oriental de padrão clássico.'}
  ];
  fs.writeFileSync(STOCK_FILE, JSON.stringify(initial, null, 2));
}

// Multer for image uploads to ./images/uploads
const uploadDir = path.join(__dirname, 'images', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random()*1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + unique + ext);
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

function readStock(){ return JSON.parse(fs.readFileSync(STOCK_FILE)); }
function writeStock(data){ fs.writeFileSync(STOCK_FILE, JSON.stringify(data, null, 2)); }

function requireAdmin(req, res, next){
  if(req.session && req.session.isAdmin){
    return next();
  }
  res.status(401).json({ error: 'Not authorized' });
}

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.post('/admin/login', (req, res) => {
  const pwd = req.body.password;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'alfredo123';
  if(pwd === ADMIN_PASSWORD){
    req.session.isAdmin = true;
    res.json({ ok:true });
  } else {
    res.status(401).json({ ok:false, error: 'Invalid password' });
  }
});

app.post('/admin/logout', (req, res) => {
  req.session.destroy(err => {
    res.json({ ok:true });
  });
});

app.get('/api/stock', (req, res) => {
  const data = readStock();
  res.json(data);
});

app.post('/api/stock', requireAdmin, (req, res) => {
  const item = req.body;
  let data = readStock();
  item.id = data.length ? (Math.max(...data.map(d=>d.id))+1) : 1;
  data.push(item);
  writeStock(data);
  res.json(item);
});

app.put('/api/stock/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id,10);
  let data = readStock();
  const idx = data.findIndex(d=>d.id===id);
  if(idx===-1) return res.status(404).json({ error:'not found' });
  data[idx] = { ...data[idx], ...req.body, id };
  writeStock(data);
  res.json(data[idx]);
});

app.delete('/api/stock/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id,10);
  let data = readStock();
  data = data.filter(d=>d.id!==id);
  writeStock(data);
  res.json({ ok:true });
});

app.post('/api/upload', requireAdmin, upload.single('image'), (req, res) => {
  if(!req.file) return res.status(400).json({ error:'no file' });
  const url = '/images/uploads/' + req.file.filename;
  res.json({ url });
});

app.get('*', (req, res) => {
  if(req.path.startsWith('/admin')){
    return res.sendFile(path.join(__dirname, 'admin.html'));
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log('Server listening on', port));
