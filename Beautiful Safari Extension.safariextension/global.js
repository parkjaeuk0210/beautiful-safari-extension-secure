function handleMessage(event) {
    if (event.name === "getBackgroundImage") {
        fetchBackgroundImage();
    }
}

async function fetchBackgroundImage() {
    try {
        const response = await fetch('https://backend-3k8vu7b0e-feras-projects-59a977f0.vercel.app/api/background');
        
        if (response.ok) {
            const data = await response.json();
            safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("backgroundImage", {
                url: data.urls.full,
                photographer: data.user.name,
                location: data.location?.name || '',
                description: data.alt_description || ''
            });
        } else {
            const fallbackImages = [
                {
                    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                    photographer: 'Unsplash',
                    location: '',
                    description: 'Beautiful mountain landscape'
                }
            ];
            
            const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
            safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("backgroundImage", randomImage);
        }
    } catch (error) {
        console.error('Failed to fetch background:', error);
        
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
        safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("backgroundImage", randomImage);
    }
}

safari.application.addEventListener("message", handleMessage, false);