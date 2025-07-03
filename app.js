// Gerekli modülleri yüklüyoruz
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');

// Express uygulamasını oluşturuyoruz
const app = express();

// Middleware'leri ayarlıyoruz
app.use(bodyParser.urlencoded({ extended: true })); // Form verilerini işlemek için
app.use(express.static('public')); // Statik dosyalar (CSS, JS) için

// EJS template engine'i ayarlıyoruz
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Blog postlarını saklamak için geçici bir dizi
// NOT: Bu uygulamada veriler sadece bellek tutuluyor, sunucu yeniden başlatıldığında kaybolur
let posts = [];

// Ana sayfa route'u
app.get('/', (req, res) => {
  // Tüm postları index.ejs'ye gönderiyoruz
  res.render('index', { posts: posts });
});

// Yeni post oluşturma sayfası route'u
app.get('/new-post', (req, res) => {
  res.render('new-post');
});

// Post oluşturma işlemi route'u (POST isteği)
app.post('/create-post', (req, res) => {
  const { title, content } = req.body;
  
  // Yeni post objesi oluşturuyoruz
  const newPost = {
    id: Date.now().toString(), // Benzersiz bir ID oluşturmak için timestamp kullanıyoruz
    title: title,
    content: content,
    createdAt: new Date().toLocaleString() // Oluşturulma tarihini kaydediyoruz
  };
  
  // Postu dizimize ekliyoruz
  posts.unshift(newPost); // En yeni post en üstte görünsün diye unshift kullanıyoruz
  
  // Ana sayfaya yönlendiriyoruz
  res.redirect('/');
});

// Post düzenleme sayfası route'u
app.get('/edit-post/:id', (req, res) => {
  const postId = req.params.id;
  
  // Düzenlenecek postu buluyoruz
  const post = posts.find(p => p.id === postId);
  
  if (post) {
    res.render('edit-post', { post: post });
  } else {
    res.redirect('/'); // Post bulunamazsa ana sayfaya yönlendir
  }
});

// Post güncelleme işlemi route'u (POST isteği)
app.post('/update-post/:id', (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  
  // Postu bulup güncelliyoruz
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex !== -1) {
    posts[postIndex].title = title;
    posts[postIndex].content = content;
    posts[postIndex].createdAt = new Date().toLocaleString(); // Güncelleme tarihini de değiştiriyoruz
  }
  
  res.redirect('/');
});

// Post silme işlemi route'u
app.post('/delete-post/:id', (req, res) => {
  const postId = req.params.id;
  
  // Postu diziden filtreleyerek çıkarıyoruz
  posts = posts.filter(p => p.id !== postId);
  
  res.redirect('/');
});

// Sunucuyu başlatıyoruz
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});