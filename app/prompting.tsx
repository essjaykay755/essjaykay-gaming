'use client';

import { useEffect, useRef, useState } from "react"
import { useGame } from './context/GameContext';

const COLOR = "#FFFFFF"
const HIT_COLOR = "#1A1A1A"
const BACKGROUND_COLOR = "#000000"
const BALL_COLOR = "#FFFFFF"
const PADDLE_COLOR = "#FFFFFF"
const LETTER_SPACING = 1

const PIXEL_MAP = {
  E: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  S: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  J: [
    [0, 0, 1, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ],
  A: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  Y: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  K: [
    [1, 0, 0, 1],
    [1, 0, 1, 0],
    [1, 1, 0, 0],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  D: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  V: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
    [0, 0, 1, 0],
  ],
  G: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  ".": [[0], [0], [0], [0], [1]],
};

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

interface Pixel {
  x: number;
  y: number;
  size: number;
  hit: boolean;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  targetY: number;
  isVertical: boolean;
}

interface SoundEffects {
  paddleHit: HTMLAudioElement;
  wallHit: HTMLAudioElement;
  pixelHits: HTMLAudioElement[];
}

export function EssJayKayDev() {
  const { gameSpeed } = useGame();
  const [showVictory, setShowVictory] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelsRef = useRef<Pixel[]>([])
  const ballRef = useRef<Ball>({ x: 0, y: 0, dx: 0, dy: 0, radius: 0 })
  const paddlesRef = useRef<Paddle[]>([])
  const scaleRef = useRef(1)
  const soundsRef = useRef<SoundEffects | null>(null)
  const lastSoundTimeRef = useRef(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const currentSpeedRef = useRef(1);
  const gameLoopRef = useRef<number>();
  const victoryCheckedRef = useRef(false);

  const scale = 1;
  const LARGE_PIXEL_SIZE = 20 * scale;
  const SMALL_PIXEL_SIZE = 10 * scale;
  const BALL_SPEED = 5 * scale;

  // Update currentSpeedRef when gameSpeed changes
  useEffect(() => {
    currentSpeedRef.current = gameSpeed;
  }, [gameSpeed]);

  // Function to initialize audio context
  const initializeAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  // Create fallback sounds if the audio files don't exist
  const createOscillator = (frequency: number, type: OscillatorType = "sine", duration = 0.1) => {
    return () => {
      try {
        const audioContext = initializeAudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
      } catch (error) {
        console.warn('Audio playback failed:', error);
      }
    };
  };

  useEffect(() => {
    // Initialize sound effects
    soundsRef.current = {
      paddleHit: new Audio("/paddle-hit.mp3"),
      wallHit: new Audio("/wall-hit.mp3"),
      pixelHits: [
        new Audio("/pixel-hit-1.mp3"),
        new Audio("/pixel-hit-2.mp3"),
        new Audio("/pixel-hit-3.mp3"),
        new Audio("/pixel-hit-4.mp3"),
        new Audio("/pixel-hit-5.mp3"),
      ],
    };

    // Set up fallback sounds
    const paddleSound = createOscillator(200, "sine", 0.15);
    const wallSound = createOscillator(150, "sine", 0.1);
    const pixelSounds = [
      createOscillator(300, "sine", 0.08),
      createOscillator(350, "sine", 0.08),
      createOscillator(400, "sine", 0.08),
      createOscillator(450, "sine", 0.08),
      createOscillator(500, "sine", 0.08),
    ];

    // Function to play sound with fallback
    const playSound = (sound: HTMLAudioElement, fallback: () => void) => {
      const now = Date.now();
      if (now - lastSoundTimeRef.current < 50) return;

      lastSoundTimeRef.current = now;

      // Try to play the audio file
      sound.currentTime = 0;
      sound.play().catch(() => {
        // If audio file fails to play, use the fallback oscillator
        fallback();
      });
    };

    // Add sound playing functions to the window object for debugging
    (window as any).playPaddleSound = () => {
      playSound(soundsRef.current!.paddleHit, paddleSound);
    };
    (window as any).playWallSound = () => {
      playSound(soundsRef.current!.wallHit, wallSound);
    };
    (window as any).playPixelSound = (index = 0) => {
      const soundIndex = index % pixelSounds.length;
      playSound(soundsRef.current!.pixelHits[soundIndex], pixelSounds[soundIndex]);
    };

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      scaleRef.current = Math.min(canvas.width / 1000, canvas.height / 1000);
      initializeGame();
    };

    const initializeGame = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Initialize ball
      const ball = ballRef.current;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.radius = 5 * scaleRef.current;
      
      // Set initial ball direction and speed
      const angle = Math.random() * Math.PI * 2;
      ball.dx = Math.cos(angle) * BALL_SPEED;
      ball.dy = Math.sin(angle) * BALL_SPEED;

      // Initialize paddles
      pixelsRef.current = [];
      const words = ["ESSJAYKAY.DEV", "GAMING"];

      const calculateWordWidth = (word: string, pixelSize: number) => {
        return (
          word.split("").reduce((width, letter) => {
            const letterWidth = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]?.[0]?.length ?? 0;
            return width + letterWidth * pixelSize + LETTER_SPACING * pixelSize;
          }, 0) -
          LETTER_SPACING * pixelSize
        );
      };

      const totalWidthLarge = calculateWordWidth(words[0], LARGE_PIXEL_SIZE);
      const totalWidthSmall = calculateWordWidth(words[1], SMALL_PIXEL_SIZE);
      const totalWidth = Math.max(totalWidthLarge, totalWidthSmall);
      const scaleFactor = (canvas.width * 0.8) / totalWidth;

      const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor;
      const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * scaleFactor;

      const largeTextHeight = 5 * adjustedLargePixelSize;
      const smallTextHeight = 5 * adjustedSmallPixelSize;
      const spaceBetweenLines = 5 * adjustedLargePixelSize;
      const totalTextHeight = largeTextHeight + spaceBetweenLines + smallTextHeight;

      let startY = (canvas.height - totalTextHeight) / 2;

      words.forEach((word, wordIndex) => {
        const pixelSize = wordIndex === 0 ? adjustedLargePixelSize : adjustedSmallPixelSize;
        const totalWidth =
          wordIndex === 0
            ? calculateWordWidth(words[0], adjustedLargePixelSize)
            : calculateWordWidth(words[1], adjustedSmallPixelSize);

        let startX = (canvas.width - totalWidth) / 2;

        word.split("").forEach((letter) => {
          const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP];
          if (!pixelMap) return;

          for (let i = 0; i < pixelMap.length; i++) {
            for (let j = 0; j < pixelMap[i].length; j++) {
              if (pixelMap[i][j]) {
                const x = startX + j * pixelSize;
                const y = startY + i * pixelSize;
                pixelsRef.current.push({ x, y, size: pixelSize, hit: false });
              }
            }
          }
          startX += (pixelMap[0].length + LETTER_SPACING) * pixelSize;
        });

        startY += wordIndex === 0 ? largeTextHeight + spaceBetweenLines : 0;
      });

      const paddleWidth = adjustedLargePixelSize;
      const paddleLength = 10 * adjustedLargePixelSize;

      paddlesRef.current = [
        {
          x: 0,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        {
          x: canvas.width - paddleWidth,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: 0,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: canvas.height - paddleWidth,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
      ];

      return {
        ballRef: ballRef.current,
        paddlesRef: paddlesRef.current,
        adjustedLargePixelSize,
        adjustedSmallPixelSize,
        essJayWidth: calculateWordWidth("ESSJAY", adjustedLargePixelSize),
        devWidth: calculateWordWidth("DEV", adjustedSmallPixelSize),
        gamingWidth: calculateWordWidth("GAMING", adjustedLargePixelSize),
      };
    };

    const updateGame = () => {
      if (showVictory) return; // Don't update game if victory is achieved

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Check for victory condition
      if (!victoryCheckedRef.current && pixelsRef.current.length > 0) {
        const allPixelsDestroyed = pixelsRef.current.every(pixel => pixel.hit);
        if (allPixelsDestroyed) {
          setShowVictory(true);
          victoryCheckedRef.current = true;
          // Stop the game loop
          if (gameLoopRef.current) {
            cancelAnimationFrame(gameLoopRef.current);
          }
          return;
        }
      }

      const ball = ballRef.current;
      const paddles = paddlesRef.current;
      const speed = currentSpeedRef.current;

      // Update ball position with current speed
      ball.x += ball.dx * speed;
      ball.y += ball.dy * speed;

      // Update paddle positions
      paddles.forEach((paddle) => {
        if (paddle.isVertical) {
          paddle.targetY = ball.y - paddle.height / 2;
          paddle.targetY = Math.max(0, Math.min(canvas.height - paddle.height, paddle.targetY));
          paddle.y += (paddle.targetY - paddle.y) * (0.1 * speed);
        } else {
          paddle.targetY = ball.x - paddle.width / 2;
          paddle.targetY = Math.max(0, Math.min(canvas.width - paddle.width, paddle.targetY));
          paddle.x += (paddle.targetY - paddle.x) * (0.1 * speed);
        }
      });

      // Wall collision
      if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        playSound(soundsRef.current!.wallHit, () => {
          (window as any).playWallSound();
        });
      }
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx = -ball.dx;
        playSound(soundsRef.current!.wallHit, () => {
          (window as any).playWallSound();
        });
      }

      // Paddle collision
      paddles.forEach((paddle) => {
        if (paddle.isVertical) {
          if (
            ball.x - ball.radius < paddle.x + paddle.width &&
            ball.x + ball.radius > paddle.x &&
            ball.y > paddle.y &&
            ball.y < paddle.y + paddle.height
          ) {
            ball.dx = -ball.dx;
            (window as any).playPaddleSound();
          }
        } else {
          if (
            ball.y - ball.radius < paddle.y + paddle.height &&
            ball.y + ball.radius > paddle.y &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width
          ) {
            ball.dy = -ball.dy;
            (window as any).playPaddleSound();
          }
        }
      });

      // Check for pixel collisions
      pixelsRef.current.forEach((pixel, index) => {
        if (
          !pixel.hit &&
          ball.x + ball.radius > pixel.x &&
          ball.x - ball.radius < pixel.x + pixel.size &&
          ball.y + ball.radius > pixel.y &&
          ball.y - ball.radius < pixel.y + pixel.size
        ) {
          pixel.hit = true;
          const centerX = pixel.x + pixel.size / 2;
          const centerY = pixel.y + pixel.size / 2;
          if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
            ball.dx = -ball.dx;
          } else {
            ball.dy = -ball.dy;
          }
          // Play a different pixel hit sound based on the pixel index
          const soundIndex = index % 5;
          (window as any).playPixelSound(soundIndex);
        }
      });
    };

    const drawGame = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx || !canvas) return;

      // Clear the canvas with black background
      ctx.fillStyle = BACKGROUND_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (showVictory) {
        // Draw victory screen
        const messages = [
          "🎉 CONGRATULATIONS! 🎉",
          "You've successfully destroyed EssJayKay.dev",
          "by doing absolutely nothing...",
          "The paddles did all the work while you",
          "probably went to make coffee.",
          "But hey, at least you stayed idle like a pro!",
          "",
          "- Subhojit Karmakar"
        ];

        const fontSize = Math.min(canvas.width, canvas.height) * 0.02;
        ctx.font = `${fontSize}px 'Press Start 2P'`;
        const lineHeight = fontSize * 1.5;
        const startY = (canvas.height - (messages.length * lineHeight)) / 2;

        // Draw text
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFFFFF";
        
        messages.forEach((message, i) => {
          ctx.fillText(message, canvas.width / 2, startY + (i * lineHeight));
        });
        return; // Return early to not draw any game elements
      }

      // Draw game components only if not in victory state
      pixelsRef.current.forEach((pixel) => {
        ctx.fillStyle = pixel.hit ? HIT_COLOR : COLOR;
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
      });

      const ball = ballRef.current;
      ctx.fillStyle = BALL_COLOR;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = PADDLE_COLOR;
      paddlesRef.current.forEach((paddle) => {
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
      });
    };

    const gameLoop = () => {
      updateGame();
      drawGame();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    gameLoop();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []); // Remove gameSpeed dependency

  // Add click handler to initialize audio context
  const handleCanvasClick = () => {
    initializeAudioContext();
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full"
      aria-label="EssJayKay.dev: Fullscreen Pong game with pixel text"
      onClick={handleCanvasClick}
    />
  );
}

// ... existing code ... 