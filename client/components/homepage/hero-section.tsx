"use client";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function HeroSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      25, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 20;
    camera.position.y = 4;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    // Clear container and add renderer
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);
    
    // Gold lighting setup - warm lights work best with gold
    // A warmer ambient light that enhances the gold color
    const ambientLight = new THREE.AmbientLight(0xfff0dd, 0.8);
    scene.add(ambientLight);

    // Add directional lights with warm tones for better gold appearance
    const directions = [
      { x: 0, y: 5, z: 10, color: 0xfff5e0, intensity: 1.0 },  // warm front light
      { x: 10, y: 0, z: 0, color: 0xffffee, intensity: 0.7 },  // right
      { x: -10, y: 0, z: 0, color: 0xfffadd, intensity: 0.7 }, // left
      { x: 0, y: 0, z: -10, color: 0xfff0cc, intensity: 0.5 }, // back
      { x: 0, y: 10, z: 0, color: 0xffffcc, intensity: 0.8 }   // top
    ];

    directions.forEach(dir => {
      const dirLight = new THREE.DirectionalLight(dir.color, dir.intensity);
      dirLight.position.set(dir.x, dir.y, dir.z);
      scene.add(dirLight);
    });
    
    // Create loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.style.position = 'absolute';
    loadingDiv.style.top = '50%';
    loadingDiv.style.left = '50%';
    loadingDiv.style.transform = 'translate(-50%, -50%)';
    loadingDiv.style.color = 'white';
    loadingDiv.style.fontSize = '16px';
    loadingDiv.style.backgroundColor = 'rgba(0,0,0,0.5)';
    loadingDiv.style.padding = '12px 20px';
    loadingDiv.style.borderRadius = '8px';
    loadingDiv.textContent = 'Loading 3D Model...';
    containerRef.current.appendChild(loadingDiv);
    
    // Create a pivot for rotation
    const pivot = new THREE.Group();
    scene.add(pivot);
    
    // Create a simple reflection environment for the gold
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128);
    const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    scene.add(cubeCamera);
    
    // Prepare texture loader
    const textureLoader = new THREE.TextureLoader();
    
    // Function to load texture with correct flipY setting for glTF
    const loadGltfTexture = (url) => {
      return new Promise((resolve, reject) => {
        textureLoader.load(
          url,
          (texture) => {
            // CRITICAL: Set flipY to false for glTF compatibility
            texture.flipY = false;
            // Make texture repeating to avoid seams during rotation
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            // Ensure texture is applied correctly during rotation
            texture.needsUpdate = true;
            resolve(texture);
          },
          undefined,
          (error) => reject(error)
        );
      });
    };
    
    // Material reference to be used in the animation loop
    let materialMap = new Map(); // Store materials by mesh id
    
    // Load the model
    const loader = new GLTFLoader();
    
    loader.load(
      '/full_sculpture.gltf',
      async (gltf) => {
        // Remove loading indicator
        if (loadingDiv.parentNode) {
          loadingDiv.parentNode.removeChild(loadingDiv);
        }
        
        const model = gltf.scene;
        
        // Set fixed scale
        const modelSize = 40;
        model.scale.set(modelSize, modelSize, modelSize);
        
        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        
        // Position model 
        model.position.x = -center.x;
        model.position.z = -center.z;
        model.position.y = -center.y + 2; // Slightly raised
        
        // Add to rotation pivot
        pivot.add(model);
        
        // Try to load a marble texture for normal mapping
        let marbleTexture = null;
        try {
          // Load marble texture with proper flipY setting
          marbleTexture = await loadGltfTexture('/marble-texture.jpg');
          console.log("Marble texture loaded successfully");
        } catch (error) {
          try {
            marbleTexture = await loadGltfTexture('/marble.jpg');
            console.log("Alternative marble texture loaded");
          } catch (err) {
            console.warn("Could not load textures for normal mapping");
          }
        }
        
        // Apply gold material to model
        model.traverse((child) => {
          if (child.isMesh) {
            // Create a realistic gold material
            const goldMaterial = new THREE.MeshStandardMaterial({
              color: 0xd4af37,      // Classic gold color
              metalness: 1.0,       // Fully metallic
              roughness: 0.1,       // Very low roughness for shine
              envMap: cubeRenderTarget.texture, // Simple environment map for reflections
              side: THREE.DoubleSide,
              flatShading: false,
            });
            
            // Enhance with a slight emissive glow for that extra golden shine
            goldMaterial.emissive.setHex(0x996515);
            goldMaterial.emissiveIntensity = 0.2;
            
            // For even more realism, add a subtle normal map
            if (marbleTexture) {
              // We can repurpose the marble texture as a subtle normal map for gold
              // to give it some texture rather than being perfectly smooth
              goldMaterial.normalMap = marbleTexture;
              goldMaterial.normalScale.set(0.1, 0.1); // Very subtle effect
            }
            
            // Store reference to material
            materialMap.set(child.id, goldMaterial);
            
            // Apply material to mesh
            child.material = goldMaterial;
            
            // Ensure proper rendering during rotation
            child.material.needsUpdate = true;
            child.geometry.computeVertexNormals();
          }
        });
      },
      undefined,
      (error) => {
        console.error('Error loading the model:', error);
        loadingDiv.textContent = 'Error loading model';
      }
    );
    
    // Enhanced animation loop with environment map updates
    const animate = function() {
      requestAnimationFrame(animate);
      
      // Rotate the pivot
      if (pivot) {
        pivot.rotation.y += 0.005;
        
        // Update environment map occasionally for better reflections
        if (Math.random() > 0.97) { // Only update occasionally for performance
          // Hide the model temporarily
          pivot.visible = false;
          
          // Update the environment map
          cubeCamera.update(renderer, scene);
          
          // Show the model again
          pivot.visible = true;
        }
        
        // Update materials during rotation
        materialMap.forEach((material) => {
          if (material) {
            material.needsUpdate = true;
          }
        });
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          containerRef.current.removeChild(canvas);
        }
      }
      
      if (renderer) {
        renderer.dispose();
      }
      
      // Clear material map
      materialMap.clear();
    };
  }, []);
  
  return (
    <section className="relative py-20 w-full bg-white dark:bg-black" aria-label="Midas Hero">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Hero Text - Left Side */}
          <div className="space-y-6 text-left px-4 relative z-10">
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-fit rounded-full border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 px-4 py-1 mb-6"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-amber-900 dark:text-amber-200">
                <Sparkles className="h-4 w-4" />
                <span>The Modern Midas Touch</span>
              </div>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-400 pb-2"
            >
              The Golden Standard of <br className="hidden sm:block" />
              Finance AI
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl"
            >
              Let Midas be your personal finance companion. Transform your spending habits
              into wealth-building opportunities and conquer your goals.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-500 text-white rounded-full px-8 h-12"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/demo" aria-label="Watch Demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 h-12 border-2 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                >
                  Watch Demo
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* 3D Model - Right Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative h-[600px] lg:h-[700px] flex items-center justify-center"
          >
            <div 
              ref={containerRef} 
              className="w-full h-full"
            >
              {/* Three.js will render here */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}