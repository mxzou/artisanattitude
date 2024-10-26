'use client'

import React, { useState, useRef, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader, Mesh } from 'three'
import { OrbitControls, MeshDistortMaterial, Environment } from '@react-three/drei'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../components/ui/button"
import { ChevronDown, Menu } from 'lucide-react'

const articles = [
  { 
    id: 1, 
    title: "The Future of Urban Design",
    excerpt: "Exploring innovative approaches to city planning and architecture.",
    content: `
      <h2>Reimagining City Spaces</h2>
      <p>As we step into a new era of urban living, architects and city planners are rethinking the very fabric of our metropolitan areas. The focus is shifting towards creating more sustainable, livable, and human-centric urban environments.</p>
      
      <h2>Sustainable Infrastructure</h2>
      <p>The cities of tomorrow are being built on the foundation of sustainability. From green buildings to smart energy grids, urban planners are integrating eco-friendly solutions into every aspect of city life.</p>
      
      <h2>Community-Centric Design</h2>
      <p>Urban designers are placing a renewed focus on creating spaces that foster community interaction and social cohesion. This involves the development of mixed-use neighborhoods, pedestrian-friendly streets, and public spaces that encourage social gatherings and cultural events.</p>
      
      <h2>The Role of Technology</h2>
      <p>Smart city technologies are revolutionizing urban management, from traffic control to waste management. The integration of IoT devices, AI, and big data analytics is enabling cities to operate more efficiently and respond more effectively to the needs of their residents.</p>
    `
  },
  { 
    id: 2, 
    title: "The Evolution of Digital Art",
    excerpt: "From pixels to virtual realities: the journey of digital artistic expression.",
    content: `
      <h2>From Pixels to Virtual Realities</h2>
      <p>The journey of digital art has been nothing short of revolutionary. From early pixel art to today's immersive VR experiences, digital artists have continually pushed the boundaries of creativity and technology.</p>
      
      <h2>AI and Generative Art</h2>
      <p>Artificial Intelligence is not just a tool but a collaborator in the creative process, giving rise to entirely new forms of artistic expression. AI algorithms can now generate unique artworks, compose music, and even write poetry, challenging our understanding of creativity and authorship.</p>
      
      <h2>NFTs and Digital Ownership</h2>
      <p>The advent of blockchain technology has introduced the concept of verifiable digital ownership, transforming how we value and collect digital art. NFTs (Non-Fungible Tokens) have created a new market for digital artworks, allowing artists to monetize their creations in unprecedented ways.</p>
      
      <h2>The Future of Digital Galleries</h2>
      <p>As the line between physical and digital spaces blurs, art galleries are evolving to showcase digital works in innovative ways. Virtual and augmented reality technologies are enabling immersive exhibition experiences, while online platforms are making art more accessible to global audiences.</p>
    `
  },
]

interface MagazineProps {
  onMagazineClick: () => void;
}

function Magazine({ onMagazineClick }: MagazineProps) {
  const mesh = useRef<Mesh>(null)
  const texture = useLoader(TextureLoader, '/magazine-cover.svg')

  useFrame((state) => {
    if (mesh.current) {
      const time = state.clock.getElapsedTime()
      mesh.current.rotation.y = Math.sin(time * 0.3) * 0.1
      mesh.current.position.y = Math.sin(time * 1.5) * 0.05
    }
  })

  return (
    <mesh ref={mesh} onClick={onMagazineClick}>
      <boxGeometry args={[3, 4, 0.2]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
}

interface ArticleContentProps {
  article: Article;
}

function ArticleContent({ article }: ArticleContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-8 overflow-y-auto h-full max-w-4xl mx-auto"
    >
      <h1 className="text-4xl font-bold mb-6 text-black">{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.content }} className="prose max-w-none" />
    </motion.div>
  )
}

const MagazineCargoHybrid: React.FC = () => {
  const [activeView, setActiveView] = useState('magazine')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeArticle, setActiveArticle] = useState<Article | null>(null)

  const handleMagazineClick = () => {
    setActiveView('articles')
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Mobile Menu */}
      <div className="md:hidden">
        <Button variant="ghost" onClick={() => setMenuOpen(!menuOpen)} className="p-2">
          <Menu />
        </Button>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-12 left-0 right-0 bg-background border-b border-border p-4 z-50"
          >
            <nav className="flex flex-col space-y-2">
              <button onClick={() => { setActiveView('magazine'); setMenuOpen(false) }} className="text-left hover:text-accent">Magazine</button>
              <button onClick={() => { setActiveView('articles'); setMenuOpen(false) }} className="text-left hover:text-accent">Articles</button>
              <button onClick={() => { setActiveView('about'); setMenuOpen(false) }} className="text-left hover:text-accent">About</button>
              <button onClick={() => { setActiveView('contact'); setMenuOpen(false) }} className="text-left hover:text-accent">Contact</button>
            </nav>
          </motion.div>
        )}
      </div>

      {/* Desktop Header */}
      <header className="hidden md:flex justify-between items-center p-4 border-b border-border">
        <h1 className="text-xl font-bold">ARTISANATTITUDE.</h1>
        <nav className="flex space-x-4">
          <button onClick={() => setActiveView('magazine')} className={`hover:text-accent ${activeView === 'magazine' ? 'text-accent' : ''}`}>Magazine</button>
          <button onClick={() => setActiveView('articles')} className={`hover:text-accent ${activeView === 'articles' ? 'text-accent' : ''}`}>Articles</button>
          <button onClick={() => setActiveView('about')} className={`hover:text-accent ${activeView === 'about' ? 'text-accent' : ''}`}>About</button>
          <button onClick={() => setActiveView('contact')} className={`hover:text-accent ${activeView === 'contact' ? 'text-accent' : ''}`}>Contact</button>
        </nav>
      </header>

      <main className="flex flex-col md:flex-row">
        {/* Left Column */}
        <div className="w-full md:w-1/2 p-4 border-r border-border">
          {activeView === 'magazine' && (
            <div className="h-[60vh]">
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading 3D experience...</div>}>
                <Canvas>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <Magazine onMagazineClick={handleMagazineClick} />
                  <OrbitControls enableZoom={false} enablePan={false} />
                  <Environment preset="studio" />
                </Canvas>
              </Suspense>
            </div>
          )}
          {activeView !== 'magazine' && (
            <>
              <h2 className="text-2xl font-bold mb-4">ARTISANATTITUDE.</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                ARTISANATTITUDE. is a cutting-edge digital magazine exploring the intersections of art, technology, and urban culture. Our platform showcases innovative projects, thought-provoking articles, and visionary ideas that shape the future of creative expression and city living.
              </p>
              <p className="text-sm leading-relaxed mt-4 text-muted-foreground">
                Dive into our curated collection of articles, featuring insights from leading artists, designers, and thinkers. Experience the fusion of traditional craftsmanship with modern digital techniques, and discover how this synergy is transforming our urban landscapes and artistic practices.
              </p>
              <p className="text-sm font-bold mt-4">Issue 34: The Digital Renaissance</p>
            </>
          )}
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2 p-4">
          {activeView === 'articles' && (
            <div className="space-y-8">
              {articles.map((article) => (
                <div key={article.id} className="border-b border-border pb-8">
                  <h3 className="text-lg font-bold">{article.title}</h3>
                  <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                  <Button 
                    className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => setActiveArticle(article)}
                  >
                    Read More
                  </Button>
                </div>
              ))}
            </div>
          )}
          {activeView === 'about' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">About ARTISANATTITUDE.</h2>
              <p className="text-sm text-muted-foreground">ARTISANATTITUDE. is a digital platform dedicated to exploring the cutting edge of art, design, and urban culture. We bring together visionaries, creators, and thinkers to showcase innovative ideas and projects that are shaping our future.</p>
            </div>
          )}
          {activeView === 'contact' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Contact Us</h2>
              <p className="text-sm text-muted-foreground">Get in touch with ARTISANATTITUDE. for collaborations, submissions, or inquiries.</p>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Send Message</Button>
            </div>
          )}
        </div>
      </main>

      {/* Article Modal */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background z-50 overflow-auto"
          >
            <div className="max-w-4xl mx-auto py-8 px-4">
              <Button 
                className="mb-4 bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setActiveArticle(null)}
              >
                Close
              </Button>
              <ArticleContent article={activeArticle} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-border p-4 text-center text-sm text-muted-foreground">
        © 2024 ARTISANATTITUDE. All rights reserved.
      </footer>
    </div>
  )
}

export default MagazineCargoHybrid
