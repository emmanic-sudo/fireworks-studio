// App.jsx
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function OnlineStudio() {
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    function createFirework(x, y) {
      for (let i = 0; i < 60; i++) {
        particles.push({
          x,
          y,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 4 + 2,
          life: 100
        });
      }
    }

    function animate() {
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.life--;
        ctx.fillStyle = `hsl(${p.life * 3},100%,60%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
        if (p.life <= 0) particles.splice(i, 1);
      });

      requestAnimationFrame(animate);
    }

    animate();
    canvas.addEventListener("click", e => createFirework(e.clientX, e.clientY));
    return () => canvas.removeEventListener("click", () => {});
  }, []);

  const addPost = () => {
    if (!image) return;
    const newPost = {
      id: Date.now(),
      image: URL.createObjectURL(image),
      caption,
      comments: []
    };
    setPosts([newPost, ...posts]);
    setImage(null);
    setCaption("");
  };

  const addComment = (id, text) => {
    setPosts(posts.map(p => p.id === id ? { ...p, comments: [...p.comments, text] } : p));
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 -z-10" />

      <div className="p-6 max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">🔥 My Fireworks Studio</h1>

        <Card className="bg-white/10 backdrop-blur-xl">
          <CardContent className="space-y-3 p-4">
            <Input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
            <Input placeholder="Lifestyle update..." value={caption} onChange={e => setCaption(e.target.value)} />
            <Button onClick={addPost}>Launch</Button>
          </CardContent>
        </Card>

        {posts.map(post => (
          <Card key={post.id} className="bg-white/10 backdrop-blur-xl">
            <CardContent className="p-4 space-y-3">
              <img src={post.image} className="rounded-2xl" />
              <p>{post.caption}</p>
              <AnonymousComments post={post} onComment={addComment} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AnonymousComments({ post, onComment }) {
  const [text, setText] = useState("");

  return (
    <div className="space-y-2">
      <p className="font-semibold">Anonymous sparks</p>
      {post.comments.map((c, i) => <p key={i} className="text-sm">✨ {c}</p>)}
      <Input placeholder="Send anonymously" value={text} onChange={e => setText(e.target.value)} />
      <Button size="sm" onClick={() => { onComment(post.id, text); setText(""); }}>Spark</Button>
    </div>
  );
}

export default OnlineStudio;
