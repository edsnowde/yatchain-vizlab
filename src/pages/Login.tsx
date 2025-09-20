import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, User, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';


interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];
    const particleCount = 60;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth / 2;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,255,255,0.7)';
        ctx.fill();

        // Line connections with other particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,255,255,${1 - dist / 120})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connect to mouse
        const dxMouse = p.x - mousePos.x;
        const dyMouse = p.y - mousePos.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,255,255,${1 - distMouse / 150})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mousePos.x, mousePos.y);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      onMouseMove={(e) => setMousePos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })}
      onMouseLeave={() => setMousePos({ x: -9999, y: -9999 })}
    />
  );
};

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (credentials.email && credentials.password) {
        toast({ title: "Login Successful", description: "Welcome to YatraChain Scientist Portal" });
        navigate('/');
      } else {
        toast({ title: "Login Failed", description: "Please enter valid credentials", variant: "destructive" });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left Side Logo + Interactive Particles */}
      <div className="flex-1 flex items-center justify-center relative bg-gradient-to-br from-blue-600 via-green-400 to-blue-500">
        <ParticleBackground />
        <img
          src="/assets/yatrachain-logo.png"
          alt="YatraChain"
          className="h-72 w-auto z-10 animate-bounce-slow drop-shadow-lg"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-blue-600 via-green-400 to-blue-500 opacity-30 z-0"></div>
      </div>

      {/* Right Side Login Form */}
      <div className="flex-1 flex items-center justify-center p-12 relative z-10">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/30 hover:scale-105 transition-transform duration-500">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3 text-blue-800">
              <LogIn className="h-8 w-8 text-green-600" />
              Scientist Portal
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Intelligent Journeys, Connected Data
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-blue-700 font-semibold">
                  <User className="h-5 w-5" /> Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="scientist@natpac.gov.in"
                  value={credentials.email}
                  onChange={e => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-300 transition-shadow duration-300 shadow-sm hover:shadow-md rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-blue-700 font-semibold">
                  <Lock className="h-5 w-5" /> Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={e => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-300 transition-shadow duration-300 shadow-sm hover:shadow-md rounded-lg"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 rounded-xl shadow-lg transition-transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/30 text-center text-sm text-white/80">
              NATPAC Mobility Research Portal<br />
              For authorized scientists only
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
