// Vercel serverless function for secure Unsplash API calls
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const response = await fetch('https://api.unsplash.com/photos/random?query=nature,landscape,mountain,ocean,sunset&orientation=landscape', {
            headers: {
                'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            res.status(200).json({
                url: data.urls.full,
                photographer: data.user.name,
                location: data.location?.name || '',
                description: data.alt_description || ''
            });
        } else {
            // Fallback images
            const fallbackImages = [
                {
                    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                    photographer: 'Unsplash',
                    location: '',
                    description: 'Beautiful mountain landscape'
                },
                {
                    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                    photographer: 'Unsplash',
                    location: '',
                    description: 'Forest landscape'
                },
                {
                    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                    photographer: 'Unsplash',
                    location: '',
                    description: 'Ocean sunset'
                }
            ];
            
            const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
            res.status(200).json(randomImage);
        }
    } catch (error) {
        console.error('Unsplash API Error:', error);
        
        // Fallback images on error
        const fallbackImages = [
            {
                url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                photographer: 'Unsplash',
                location: '',
                description: 'Beautiful mountain landscape'
            },
            {
                url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                photographer: 'Unsplash',
                location: '',
                description: 'Forest landscape'
            },
            {
                url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                photographer: 'Unsplash',
                location: '',
                description: 'Ocean sunset'
            }
        ];
        
        const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
        res.status(200).json(randomImage);
    }
}