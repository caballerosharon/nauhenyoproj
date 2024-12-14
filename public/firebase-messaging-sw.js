// Use latest version of Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyBlXbQWKKW3Dhw4zyLgpkfPMsxThgpe8iI',
  authDomain: 'projectnauhenyo-8a674.firebaseapp.com',
  projectId: 'projectnauhenyo-8a674',
  storageBucket: 'projectnauhenyo-8a674.appspot.com',
  messagingSenderId: '340792540214',
  appId: '1:340792540214:web:d9672947ef0c0bd1aaac97',
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  try {
    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
      body: payload.notification?.body || '',
      icon: '/naulogo.png',
      badge: '/naulogo.png',
      tag: payload.notification?.tag || `notification-${Date.now()}`,
      data: payload.data || {},
      actions: [
        {
          action: 'view',
          title: 'View Details'
        }
      ],
      vibrate: [200, 100, 200],
      requireInteraction: true,
      timestamp: Date.now()
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  } catch (error) {
    console.error('[firebase-messaging-sw.js] Error showing notification:', error);
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  
  event.notification.close();
  
  const clickAction = event.action === 'view' ? 'view' : 'default';
  const reportId = event.notification.data?.reportId;
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes('bfpdashboard') && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        const url = reportId 
          ? `/bfpdashboard?report=${reportId}&action=${clickAction}`
          : '/bfpdashboard';
        return clients.openWindow(url);
      })
      .catch(error => {
        console.error('[firebase-messaging-sw.js] Error handling notification click:', error);
      })
  );
});

// Handle service worker installation
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker installed');
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker activated');
  event.waitUntil(clients.claim());
});