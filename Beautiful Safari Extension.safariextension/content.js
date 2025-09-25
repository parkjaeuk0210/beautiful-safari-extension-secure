if (window.top === window) {
    function isNewTabPage() {
        return (
            window.location.href === 'about:blank' ||
            window.location.href === 'safari-resource:/index.html' ||
            window.location.pathname === '/index.html' ||
            document.title === '' ||
            document.title === 'Untitled'
        );
    }

    function loadElegantSpace() {
        document.documentElement.innerHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Elegant Space</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-gradient: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
            --glass-bg: rgba(255, 255, 255, 0.05);
            --glass-border: rgba(255, 255, 255, 0.1);
            --text-primary: rgba(255, 255, 255, 0.95);
            --text-secondary: rgba(255, 255, 255, 0.7);
            --text-tertiary: rgba(255, 255, 255, 0.5);
            --accent-color: #6366f1;
            --hover-scale: 1.02;
            --animation-smooth: cubic-bezier(0.4, 0, 0.2, 1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { font-size: 16px; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-weight: 400; line-height: 1.6; color: var(--text-primary); background: #000;
            height: 100vh; overflow: hidden; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
        }

        .background-layer { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -10; }
        .background-image {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background-size: cover; background-position: center; background-repeat: no-repeat;
            opacity: 0; transition: opacity 2s var(--animation-smooth); transform: scale(1.05);
        }
        .background-image.loaded { opacity: 1; }
        .background-gradient {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.05) 60%, rgba(0, 0, 0, 0.2) 100%);
        }

        .app-container { position: relative; width: 100%; height: 100vh; display: flex; flex-direction: column; z-index: 10; }
        .header {
            position: absolute; top: 0; left: 0; right: 0; display: flex; justify-content: space-between;
            align-items: center; padding: 2rem 3rem; z-index: 100; animation: slideDown 0.8s var(--animation-smooth);
        }

        .chat-toggle-container {
            opacity: 0;
            animation: slideDown 0.8s var(--animation-smooth) 0.4s forwards;
        }

        .nav { display: flex; gap: 0.75rem; opacity: 0; animation: fadeInUp 0.8s var(--animation-smooth) 0.5s forwards; }
        .nav-btn {
            position: relative; background: var(--glass-bg); border: 1px solid var(--glass-border);
            border-radius: 16px; width: 48px; height: 48px; display: flex; align-items: center;
            justify-content: center; cursor: pointer; transition: all 0.3s var(--animation-smooth);
            backdrop-filter: blur(20px); color: var(--text-secondary); overflow: hidden;
        }
        .nav-btn::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            background: var(--primary-gradient); opacity: 0; transition: opacity 0.3s var(--animation-smooth);
        }
        .nav-btn svg { position: relative; z-index: 2; transition: all 0.3s var(--animation-smooth); }
        .nav-btn:hover {
            transform: translateY(-2px) scale(var(--hover-scale)); border-color: rgba(255, 255, 255, 0.2);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15); color: var(--text-primary);
        }
        .nav-btn:hover::before { opacity: 1; }

        .main-content { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; gap: 4rem; }
        .hero-section { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 2rem; }
        .time-display { opacity: 0; animation: fadeInUp 1s var(--animation-smooth) 0.2s forwards; }
        .current-time {
            font-size: clamp(3rem, 8vw, 6rem); font-weight: 200; letter-spacing: -0.05em;
            color: var(--text-primary); margin-bottom: 0.5rem; text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            font-variant-numeric: tabular-nums;
        }
        .current-date { font-size: clamp(1rem, 2vw, 1.25rem); color: var(--text-secondary); font-weight: 400; letter-spacing: 0.025em; }

        .greeting-section { opacity: 0; animation: fadeInUp 1s var(--animation-smooth) 0.4s forwards; }
        .greeting-text {
            font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 300; color: var(--text-primary);
            margin-bottom: 1rem; cursor: pointer; transition: all 0.3s var(--animation-smooth); letter-spacing: -0.025em;
        }
        .greeting-text:hover { transform: scale(1.02); color: var(--accent-color); }

        .name-input-wrapper { position: relative; margin-top: 1rem; }
        .name-input {
            background: transparent; border: none; border-bottom: 2px solid var(--glass-border);
            padding: 0.75rem 0; font-size: 1.25rem; color: var(--text-primary); text-align: center;
            outline: none; min-width: 300px; font-family: inherit; font-weight: 300;
            transition: all 0.3s var(--animation-smooth);
        }
        .name-input::placeholder { color: var(--text-tertiary); font-style: italic; }
        .name-input:focus { border-bottom-color: var(--accent-color); }

        .info-section { opacity: 0; animation: fadeInUp 1s var(--animation-smooth) 0.6s forwards; }
        .info-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; max-width: 800px; }
        .info-card {
            background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 24px;
            padding: 1.5rem; backdrop-filter: blur(20px); transition: all 0.4s var(--animation-smooth);
            position: relative; overflow: hidden;
        }
        .info-card:hover {
            transform: translateY(-4px) scale(var(--hover-scale)); border-color: rgba(255, 255, 255, 0.2);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .card-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; position: relative; z-index: 2; }
        .card-icon {
            display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;
            background: rgba(255, 255, 255, 0.1); border-radius: 12px; color: var(--text-secondary);
            transition: all 0.3s var(--animation-smooth);
        }
        .card-title {
            font-size: 0.875rem; font-weight: 500; color: var(--text-secondary);
            text-transform: uppercase; letter-spacing: 0.05em;
        }

        .quote { position: relative; z-index: 2; }
        .quote-text { font-size: 1.125rem; font-weight: 400; color: var(--text-primary); line-height: 1.6; margin-bottom: 0.75rem; font-style: italic; }
        .quote-author { font-size: 0.875rem; color: var(--text-secondary); font-weight: 500; font-style: normal; }
        .weather-content { position: relative; z-index: 2; }
        .weather-text { font-size: 1.125rem; font-weight: 500; color: var(--text-primary); }

        .mini-calendar {
            position: fixed; top: 6rem; right: 3rem; background: var(--glass-bg); border: 1px solid var(--glass-border);
            border-radius: 16px; padding: 1rem; backdrop-filter: blur(20px); color: var(--text-primary);
            width: 200px; opacity: 0; z-index: 200;
        }
        .mini-calendar.show { animation: fadeInUp 1s var(--animation-smooth) 0.7s forwards; }
        .mini-calendar.hidden { display: none; }
        .mini-calendar-header { margin-bottom: 0.75rem; text-align: center; }
        .mini-calendar-title { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); margin: 0; }
        .mini-calendar-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.125rem; margin-bottom: 0.375rem; }
        .mini-weekday { text-align: center; font-size: 0.625rem; font-weight: 500; color: var(--text-secondary); padding: 0.25rem 0; text-transform: uppercase; letter-spacing: 0.05em; }
        .mini-calendar-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.125rem; }
        .mini-calendar-day {
            aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 0.625rem;
            font-weight: 400; color: var(--text-secondary); border-radius: 4px; cursor: pointer;
            transition: all 0.2s var(--animation-smooth); position: relative; min-height: 20px;
        }
        .mini-calendar-day:hover { background: rgba(255, 255, 255, 0.1); color: var(--text-primary); transform: scale(1.1); }
        .mini-calendar-day.today { background: var(--accent-color); color: white; font-weight: 600; }
        .mini-calendar-day.other-month { color: var(--text-tertiary); opacity: 0.5; }

        .footer { position: fixed; bottom: 1.5rem; left: 1.5rem; z-index: 100; pointer-events: none; }
        .photo-credit {
            display: flex; align-items: center; gap: 0.5rem; background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 0.5rem 0.75rem;
            backdrop-filter: blur(20px); color: var(--text-tertiary); font-size: 0.75rem;
            transition: all 0.3s var(--animation-smooth); opacity: 0.6;
            animation: fadeInUp 1s var(--animation-smooth) 0.8s forwards; max-width: fit-content; pointer-events: auto;
        }
        .photo-credit:hover { background: rgba(0, 0, 0, 0.6); color: var(--text-secondary); transform: translateY(-2px); opacity: 1; }

        @keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeInUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        @media (max-width: 768px) {
            .header { padding: 1.5rem 2rem; }
            .main-content { padding: 1rem; gap: 2rem; }
            .info-cards { grid-template-columns: 1fr; gap: 1rem; }
            .footer { bottom: 1rem; left: 1rem; }
            .name-input { min-width: 250px; font-size: 1.125rem; }
            .mini-calendar { top: 4rem; right: 1rem; width: 180px; padding: 0.75rem; }
        }

        @media (max-width: 480px) {
            .header { padding: 1rem 1.5rem; }
            .main-content { gap: 1.5rem; }
            .info-card { padding: 1.25rem; }
            .nav { gap: 0.5rem; }
            .nav-btn { width: 44px; height: 44px; }
            .name-input { min-width: 200px; }
            .footer { bottom: 0.75rem; left: 0.75rem; }
        }

        @media (max-width: 320px) {
            .mini-calendar { width: calc(100vw - 2rem); right: 1rem; left: 1rem; }
        }

        /* Memo Popup - Premium Minimal Design */
        .memo-popup {
            position: absolute; z-index: 10000; opacity: 0;
            transform: translateY(-12px) scale(0.92);
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none;
            filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0));
        }
        .memo-popup.show {
            opacity: 1; transform: translateY(0) scale(1);
            pointer-events: auto;
            filter: drop-shadow(0 16px 40px rgba(0, 0, 0, 0.08));
        }
        .memo-popup-content {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 16px;
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05) inset,
                        0 8px 32px rgba(0, 0, 0, 0.06),
                        0 1px 2px rgba(0, 0, 0, 0.08);
            width: 280px; padding: 0; overflow: hidden; position: relative;
        }
        .memo-popup-content::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
        }
        .memo-popup-arrow {
            position: absolute; bottom: -7px; left: 50%;
            width: 14px; height: 14px;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-top: none; border-left: none;
            transform: translateX(-50%) rotate(45deg);
            box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.04);
        }
        .memo-popup.below .memo-popup-arrow {
            top: -7px; bottom: auto;
            transform: translateX(-50%) rotate(-135deg);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-bottom: none; border-right: none;
            box-shadow: -2px -2px 8px rgba(0, 0, 0, 0.04);
        }
        .memo-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 1rem 1.25rem 0; background: transparent;
        }
        .memo-date-section {
            display: flex; flex-direction: column; gap: 0;
        }
        .memo-date {
            font-size: 1.5rem; font-weight: 300; line-height: 1;
            color: rgba(0, 0, 0, 0.85); letter-spacing: -0.02em;
        }
        .memo-month {
            font-size: 0.7rem; font-weight: 500; text-transform: uppercase;
            letter-spacing: 0.05em; color: rgba(0, 0, 0, 0.45); margin-top: -2px;
        }
        .memo-close {
            background: rgba(0, 0, 0, 0.04); border: none;
            width: 28px; height: 28px; border-radius: 8px; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            color: rgba(0, 0, 0, 0.4);
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .memo-close:hover {
            background: rgba(0, 0, 0, 0.08); color: rgba(0, 0, 0, 0.7);
            transform: scale(1.05);
        }
        .memo-close:active {
            transform: scale(0.95); transition: all 0.1s ease;
        }
        .memo-input-container {
            position: relative; padding: 0.75rem 1.25rem 1rem;
        }
        .memo-input {
            width: 100%; min-height: 88px; max-height: 160px; resize: none;
            border: none; padding: 1rem;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 0.95rem; font-weight: 400; line-height: 1.5;
            background: rgba(248, 250, 252, 0.6); color: rgba(0, 0, 0, 0.87);
            border-radius: 12px; box-sizing: border-box;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            border: 1px solid rgba(0, 0, 0, 0.06);
        }
        .memo-input:focus {
            outline: none; background: rgba(255, 255, 255, 0.9);
            border-color: rgba(99, 102, 241, 0.25);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
        }
        .memo-input::placeholder {
            color: rgba(0, 0, 0, 0.35); font-weight: 400;
        }
        .memo-actions {
            display: flex; align-items: center; justify-content: space-between;
            padding: 0 1.25rem 1rem; background: transparent;
        }
        .memo-count {
            font-size: 0.75rem; font-weight: 500; color: rgba(0, 0, 0, 0.4);
            letter-spacing: 0.025em;
        }
        .memo-buttons {
            display: flex; gap: 0.5rem; align-items: center;
        }
        .memo-save, .memo-delete {
            padding: 0.5rem 1rem; border: none; border-radius: 8px;
            font-weight: 500; font-size: 0.85rem; cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            letter-spacing: 0.025em;
        }
        .memo-save {
            background: rgba(0, 0, 0, 0.87); color: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        }
        .memo-save:hover {
            background: rgba(0, 0, 0, 0.95); transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .memo-save:active {
            transform: translateY(0);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        }
        .memo-delete {
            background: transparent; color: rgba(239, 68, 68, 0.8);
            border: 1px solid rgba(239, 68, 68, 0.15);
        }
        .memo-delete:hover {
            background: rgba(239, 68, 68, 0.08); color: rgba(239, 68, 68, 1);
            border-color: rgba(239, 68, 68, 0.25); transform: translateY(-1px);
        }
        .mini-calendar-day {
            position: relative; cursor: pointer; transition: all 0.15s ease;
        }
        .mini-calendar-day:hover {
            background: rgba(255, 255, 255, 0.15) !important;
            transform: scale(1.05);
        }
        .mini-calendar-day.has-memo {
            font-weight: 600; color: rgba(99, 102, 241, 0.9);
        }
        .memo-indicator {
            position: absolute; bottom: 2px; right: 2px;
            width: 3px; height: 3px; background: rgba(99, 102, 241, 0.8);
            border-radius: 50%; box-shadow: 0 0 3px rgba(99, 102, 241, 0.4);
        }

        /* AI Chat Panel Styles */
        .chat-panel {
            position: fixed; top: 2rem; left: 3rem; width: 380px; height: 500px;
            background: var(--glass-bg); border: 1px solid var(--glass-border);
            border-radius: 24px; backdrop-filter: blur(20px); z-index: 200;
            display: flex; flex-direction: column; transform: translateX(-100%) scale(0.95);
            opacity: 0; transition: all 0.4s var(--animation-smooth);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); overflow: hidden;
        }

        .chat-panel.active { transform: translateX(0) scale(1); opacity: 1; }

        .chat-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--glass-border);
            background: rgba(255, 255, 255, 0.02);
        }

        .chat-header-actions {
            display: flex; align-items: center; gap: 0.5rem;
        }

        .chat-action-btn {
            background: none; border: none; color: var(--text-secondary);
            cursor: pointer; padding: 0.25rem; border-radius: 8px;
            transition: all 0.3s var(--animation-smooth);
            display: flex; align-items: center; justify-content: center;
        }

        .chat-action-btn:hover {
            color: var(--text-primary); background: rgba(255, 255, 255, 0.1);
            transform: scale(1.1);
        }

        .chat-title {
            display: flex; align-items: center; gap: 0.75rem;
            color: var(--text-primary); font-weight: 600; font-size: 0.95rem;
        }

        .chat-title svg { color: var(--accent-color); }

        .chat-close-btn {
            background: none; border: none; color: var(--text-secondary);
            cursor: pointer; padding: 0.25rem; border-radius: 8px;
            transition: all 0.3s var(--animation-smooth);
            display: flex; align-items: center; justify-content: center;
        }

        .chat-close-btn:hover {
            color: var(--text-primary); background: rgba(255, 255, 255, 0.1); transform: scale(1.1);
        }

        .chat-messages {
            flex: 1; padding: 1.5rem; overflow-y: auto;
            display: flex; flex-direction: column; gap: 1rem;
        }

        .chat-messages::-webkit-scrollbar { width: 6px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 3px; }
        .chat-messages::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }

        .chat-welcome { text-align: center; padding: 2rem 1rem; }

        .welcome-icon {
            width: 48px; height: 48px; margin: 0 auto 1rem;
            background: var(--primary-gradient); border-radius: 16px;
            display: flex; align-items: center; justify-content: center; color: var(--accent-color);
        }

        .chat-welcome h3 {
            color: var(--text-primary); font-size: 1.1rem;
            font-weight: 600; margin-bottom: 0.5rem;
        }

        .chat-welcome p { color: var(--text-secondary); font-size: 0.85rem; line-height: 1.5; }

        .chat-message { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
        .chat-message.user { flex-direction: row-reverse; }

        .message-avatar {
            width: 32px; height: 32px; border-radius: 12px;
            display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        .message-avatar.user { background: var(--accent-color); color: white; }
        .message-avatar.ai { background: var(--primary-gradient); color: var(--accent-color); }

        .message-content {
            flex: 1; background: var(--glass-bg); border: 1px solid var(--glass-border);
            border-radius: 16px; padding: 0.875rem 1rem; color: var(--text-primary);
            font-size: 0.875rem; line-height: 1.5; backdrop-filter: blur(10px);
        }

        .chat-message.user .message-content {
            background: var(--accent-color); color: white; border-color: transparent;
        }

        .message-typing { display: flex; gap: 4px; padding: 0.5rem; }

        .typing-dot {
            width: 6px; height: 6px; border-radius: 50%;
            background: var(--text-secondary);
            animation: typingDots 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingDots {
            0%, 60%, 100% { transform: scale(0.8); opacity: 0.5; }
            30% { transform: scale(1); opacity: 1; }
        }

        .chat-input-container {
            padding: 1.25rem 1.5rem; border-top: 1px solid var(--glass-border);
            background: rgba(255, 255, 255, 0.02);
        }

        .file-preview {
            display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.75rem;
        }

        .file-item {
            display: flex; align-items: center; gap: 0.75rem;
            background: var(--glass-bg); border: 1px solid var(--glass-border);
            border-radius: 12px; padding: 0.75rem 1rem;
            font-size: 0.85rem; color: var(--text-secondary);
            backdrop-filter: blur(10px);
        }

        .file-info {
            display: flex; flex-direction: column; flex: 1; gap: 0.25rem;
        }

        .file-name {
            color: var(--text-primary); font-weight: 500;
        }

        .file-size {
            color: var(--text-tertiary); font-size: 0.75rem;
        }

        .file-remove {
            background: none; border: none; color: var(--text-tertiary);
            cursor: pointer; padding: 0.25rem; border-radius: 6px;
            transition: all 0.2s var(--animation-smooth);
            display: flex; align-items: center; justify-content: center;
        }

        .file-remove:hover {
            color: #ff6b6b; background: rgba(255, 107, 107, 0.1);
        }

        .chat-upload-btn {
            background: none; border: none; color: var(--text-secondary);
            cursor: pointer; padding: 0.5rem; border-radius: 10px;
            transition: all 0.3s var(--animation-smooth);
            display: flex; align-items: center; justify-content: center;
            margin-right: 0.5rem;
        }

        .chat-upload-btn:hover {
            color: var(--text-primary); background: rgba(255, 255, 255, 0.1);
            transform: scale(1.05);
        }

        .chat-upload-btn.has-files {
            color: var(--accent-color); background: rgba(99, 102, 241, 0.2);
        }

        .file-names {
            color: var(--text-secondary); font-size: 0.8rem;
            max-width: 120px; overflow: hidden; text-overflow: ellipsis;
            white-space: nowrap; margin-right: 0.5rem;
        }

        .file-names:not(:empty) {
            color: var(--accent-color); font-weight: 500;
        }

        .chat-input-wrapper {
            position: relative; display: flex; align-items: center; gap: 0.5rem;
        }

        .chat-input {
            flex: 1; background: var(--glass-bg); border: 1px solid var(--glass-border);
            border-radius: 16px; padding: 0.875rem 1rem; color: var(--text-primary);
            font-size: 0.875rem; outline: none; transition: all 0.3s var(--animation-smooth);
            backdrop-filter: blur(10px);
        }

        .chat-input:focus {
            border-color: var(--accent-color);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .chat-input::placeholder { color: var(--text-tertiary); }

        .chat-send-btn {
            width: 40px; height: 40px; background: var(--accent-color);
            border: none; border-radius: 12px; color: white; cursor: pointer;
            transition: all 0.3s var(--animation-smooth);
            display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        .chat-send-btn:hover {
            transform: scale(1.05); box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
        }

        .chat-send-btn:active { transform: scale(0.95); }

        .chat-send-btn:disabled {
            opacity: 0.5; cursor: not-allowed; transform: none;
        }

        @media (max-width: 768px) {
            .chat-panel { left: 1rem; right: 1rem; width: auto; top: 1rem; }
            .header { padding: 1.5rem 1.5rem; }
        }
    </style>
</head>
<body>
    <div class="background-layer">
        <div class="background-image" id="background-image"></div>
        <div class="background-gradient"></div>
    </div>
    
    <div class="app-container">
        <header class="header">
            <div class="chat-toggle-container">
                <button class="nav-btn" id="chat-toggle" title="AI Chat">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        <path d="M8 9h8"/>
                        <path d="M8 13h6"/>
                    </svg>
                </button>
            </div>
            <nav class="nav">
                <button class="nav-btn" id="refresh-bg" title="New background">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M23 4v6h-6M1 20v-6h6"/>
                        <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                </button>
                <button class="nav-btn" id="settings" title="Settings">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                </button>
            </nav>
        </header>

        <main class="main-content">
            <section class="hero-section">
                <div class="time-display">
                    <h1 class="current-time" id="current-time">--:--</h1>
                    <p class="current-date" id="current-date">Loading...</p>
                </div>
                
                <div class="greeting-section">
                    <div class="greeting-content">
                        <h2 class="greeting-text" id="greeting">Welcome</h2>
                        <div class="name-input-wrapper" id="name-input-wrapper">
                            <input type="text" id="name-input" class="name-input" placeholder="What's your name?" maxlength="20" autocomplete="off">
                        </div>
                    </div>
                </div>
            </section>

            <section class="info-section">
                <div class="info-cards">
                    <div class="info-card quote-card" id="quote-card">
                        <div class="card-header">
                            <div class="card-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                                </svg>
                            </div>
                            <h3 class="card-title">Daily Inspiration</h3>
                        </div>
                        <blockquote class="quote" id="daily-quote">
                            <p class="quote-text">"Today is a beautiful day for new beginnings."</p>
                            <cite class="quote-author">— Elegant Space</cite>
                        </blockquote>
                    </div>

                    <div class="info-card weather-card" id="mood-card">
                        <div class="card-header">
                            <div class="card-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="5"/>
                                    <line x1="12" y1="1" x2="12" y2="3"/>
                                    <line x1="12" y1="21" x2="12" y2="23"/>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                                    <line x1="1" y1="12" x2="3" y2="12"/>
                                    <line x1="21" y1="12" x2="23" y2="12"/>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                                </svg>
                            </div>
                            <h3 class="card-title">Today's Mood</h3>
                        </div>
                        <div class="weather-content">
                            <span class="weather-text" id="weather-info">☀️ Bright & Inspiring</span>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Mini Calendar Widget -->
            <div class="mini-calendar" id="mini-calendar">
                <div class="mini-calendar-header">
                    <button class="calendar-nav-btn" id="prev-month" data-tooltip="이전 달">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15,18 9,12 15,6"></polyline>
                        </svg>
                    </button>
                    <div class="calendar-title">
                        <span class="mini-calendar-month" id="mini-calendar-month">Jan</span>
                        <span class="mini-calendar-year" id="mini-calendar-year">2024</span>
                    </div>
                    <button class="calendar-nav-btn" id="next-month" data-tooltip="다음 달">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9,6 15,12 9,18"></polyline>
                        </svg>
                    </button>
                </div>
                <div class="mini-calendar-grid">
                    <div class="mini-calendar-weekdays">
                        <div class="mini-weekday">S</div>
                        <div class="mini-weekday">M</div>
                        <div class="mini-weekday">T</div>
                        <div class="mini-weekday">W</div>
                        <div class="mini-weekday">T</div>
                        <div class="mini-weekday">F</div>
                        <div class="mini-weekday">S</div>
                    </div>
                    <div class="mini-calendar-days" id="mini-calendar-days">
                        <!-- Dynamic days will be inserted here -->
                    </div>
                </div>
            </div>
        </main>

        <footer class="footer">
            <div class="photo-credit" id="photo-credit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                </svg>
                <span id="photo-info">Beautiful Image</span>
            </div>
        </footer>
    </div>

    <!-- AI Chat Panel -->
    <div class="chat-panel" id="chat-panel">
        <div class="chat-header">
            <div class="chat-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>AI Assistant</span>
            </div>
            <div class="chat-header-actions">
                <button class="chat-action-btn" id="chat-reset" data-tooltip="대화 초기화">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M23 4v6h-6M1 20v-6h6"/>
                        <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                </button>
                <button class="chat-close-btn" id="chat-close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </div>
        <div class="chat-messages" id="chat-messages">
            <div class="chat-welcome">
                <div class="welcome-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </div>
                <h3>Hello! I'm your AI assistant</h3>
                <p>I can help you with questions, searches, and information from the web. What would you like to know?</p>
            </div>
        </div>
        <div class="chat-input-container">
            <div class="chat-input-wrapper">
                <input type="text" id="chat-input" class="chat-input" placeholder="Ask me anything..." maxlength="500">
                <button class="chat-upload-btn" id="chat-upload" data-tooltip="이미지/파일 업로드">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="12" y1="17" x2="12" y2="9"/>
                    </svg>
                    <input type="file" id="chat-file-input" accept="image/*,.pdf,.txt,.doc,.docx" style="display: none;" multiple>
                </button>
                <span class="file-names" id="file-names"></span>
                <button class="chat-send-btn" id="chat-send">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22,2 15,22 11,13 2,9"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</body>
</html>
        `;

        const script = document.createElement('script');
        script.textContent = \`
            class ElegantSpace {
                constructor() {
                    this.currentBackground = null;
                    this.userName = localStorage.getItem('elegant-space-username') || '';
                    this.lastBackgroundChange = localStorage.getItem('elegant-space-last-bg') || 0;
                    
                    this.settings = {
                        showQuoteCard: localStorage.getItem('elegant-space-show-quote') !== 'false',
                        showMoodCard: localStorage.getItem('elegant-space-show-mood') !== 'false',
                        showCalendar: localStorage.getItem('elegant-space-show-calendar') === 'true'
                    };
                    
                    // Initialize memo storage
                    this.memos = JSON.parse(localStorage.getItem('elegant-space-memos') || '{}');
                    
                    // Memo management mode
                    this.memoManagementMode = false;
                    
                    // Chat functionality
                    this.chatPanel = null;
                    this.chatMessages = null;
                    this.chatInput = null;
                    this.chatSendBtn = null;
                    this.chatReset = null;
                    this.chatUpload = null;
                    this.chatFileInput = null;
                    this.isChatOpen = false;
                    this.isTyping = false;
                    this.chatUploadedFiles = [];
                    
                    // Backend API configuration - API key is secure on server
                    this.apiEndpoint = 'https://backend-3k8vu7b0e-feras-projects-59a977f0.vercel.app/api';
                    
                    this.quotes = [
                        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
                        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
                        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
                        { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
                        { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
                        { text: "Design is not just what it looks like. Design is how it works.", author: "Steve Jobs" }
                    ];

                    this.moodStates = [
                        { icon: "☀️", text: "Bright & Inspiring" },
                        { icon: "🌙", text: "Calm & Peaceful" },
                        { icon: "⭐", text: "Creative & Focused" },
                        { icon: "🌸", text: "Fresh & Optimistic" },
                        { icon: "🍃", text: "Natural & Serene" }
                    ];
                    
                    this.init();
                }

                init() {
                    this.preloadElements();
                    this.setupTimeDisplay();
                    this.setupGreeting();
                    this.setupEventListeners();
                    this.setupChatUpload(); // 새로 추가!
                    this.loadBackgroundImage();
                    this.displayQuote();
                    this.updateMood();
                    this.setupMiniCalendar();
                    this.applySettings();
                }

                preloadElements() {
                    this.timeElement = document.getElementById('current-time');
                    this.dateElement = document.getElementById('current-date');
                    this.greetingElement = document.getElementById('greeting');
                    this.nameInputWrapper = document.getElementById('name-input-wrapper');
                    this.nameInput = document.getElementById('name-input');
                    this.bgElement = document.getElementById('background-image');
                    this.photoInfo = document.getElementById('photo-info');
                    this.miniCalendar = document.getElementById('mini-calendar');
                    this.quoteCard = document.getElementById('quote-card');
                    this.moodCard = document.getElementById('mood-card');
                    
                    // Chat elements
                    this.chatPanel = document.getElementById('chat-panel');
                    this.chatMessages = document.getElementById('chat-messages');
                    this.chatInput = document.getElementById('chat-input');
                    this.chatSendBtn = document.getElementById('chat-send');
                    this.chatReset = document.getElementById('chat-reset');
                    this.chatUpload = document.getElementById('chat-upload');
                    this.chatFileInput = document.getElementById('chat-file-input');
                    this.fileNamesSpan = document.getElementById('file-names');
                }

                setupTimeDisplay() {
                    this.updateTime();
                    setInterval(() => this.updateTime(), 1000);
                }

                updateTime() {
                    const now = new Date();
                    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                    const dateString = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    if (this.timeElement) this.timeElement.textContent = timeString;
                    if (this.dateElement) this.dateElement.textContent = dateString;
                }

                setupGreeting() {
                    this.updateGreetingDisplay();
                    this.nameInput?.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter' && this.nameInput.value.trim()) {
                            this.handleNameSubmit();
                        }
                    });
                    this.greetingElement?.addEventListener('click', () => this.showNameInput());
                }

                handleNameSubmit() {
                    const newName = this.nameInput.value.trim();
                    if (newName) {
                        this.userName = newName;
                        localStorage.setItem('elegant-space-username', this.userName);
                        this.updateGreetingDisplay();
                        this.hideNameInput();
                    }
                }

                updateGreetingDisplay() {
                    if (!this.greetingElement) return;
                    if (this.userName) {
                        this.greetingElement.textContent = this.getGreetingMessage(this.userName);
                        this.hideNameInput();
                    } else {
                        this.greetingElement.textContent = 'Welcome';
                        this.showNameInput();
                    }
                }

                showNameInput() {
                    if (this.nameInputWrapper) {
                        this.nameInputWrapper.style.display = 'block';
                        setTimeout(() => this.nameInput?.focus(), 100);
                    }
                }

                hideNameInput() { if (this.nameInputWrapper) this.nameInputWrapper.style.display = 'none'; }

                getGreetingMessage(name) {
                    const hour = new Date().getHours();
                    let timeGreeting = '';
                    if (hour < 12) timeGreeting = 'Good morning';
                    else if (hour < 17) timeGreeting = 'Good afternoon';
                    else if (hour < 22) timeGreeting = 'Good evening';
                    else timeGreeting = 'Good night';
                    return \`\${timeGreeting}, \${name}\`;
                }

                setupEventListeners() {
                    const refreshBtn = document.getElementById('refresh-bg');
                    const settingsBtn = document.getElementById('settings');
                    const chatToggleBtn = document.getElementById('chat-toggle');
                    const chatCloseBtn = document.getElementById('chat-close');

                    refreshBtn?.addEventListener('click', () => this.loadBackgroundImage(true));
                    
                    settingsBtn?.addEventListener('click', () => this.showSettings());

                    // Chat event listeners
                    chatToggleBtn?.addEventListener('click', () => this.toggleChat());
                    chatCloseBtn?.addEventListener('click', () => this.closeChat());
                    
                    // Chat reset functionality
                    this.chatReset?.addEventListener('click', () => this.resetChat());

                    // Chat upload functionality now handled in setupChatUpload()
                    console.log('ℹ️ Chat upload event listeners moved to setupChatUpload() method');
                    
                    this.chatSendBtn?.addEventListener('click', () => this.sendMessage());
                    
                    this.chatInput?.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            this.sendMessage();
                        }
                    });

                    // Close chat on escape key
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape' && this.isChatOpen) {
                            this.closeChat();
                        }
                    });
                }

                loadBackgroundImage(forceRefresh = false) {
                    localStorage.setItem('elegant-space-last-bg', Date.now().toString());
                    this.loadFallbackImage();
                }

                loadFallbackImage() {
                    const fallbackImages = [
                        { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80', photographer: 'Jeremy Bishop', location: 'Milford Sound, New Zealand' },
                        { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80', photographer: 'Casey Horner', location: 'Forest Trail' },
                        { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80', photographer: 'David Marcu', location: 'Lake Como, Italy' }
                    ];
                    const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
                    this.setBackgroundImage(randomImage);
                }

                setBackgroundImage(imageData) {
                    this.currentBackground = imageData;
                    if (this.bgElement) {
                        this.bgElement.style.backgroundImage = \`url(\${imageData.url})\`;
                        setTimeout(() => this.bgElement.classList.add('loaded'), 100);
                    }
                    this.updatePhotoCredit(imageData);
                }

                updatePhotoCredit(imageData) {
                    if (this.photoInfo) {
                        let creditText = imageData.photographer;
                        if (imageData.location) creditText += \` • \${imageData.location}\`;
                        this.photoInfo.textContent = creditText;
                    }
                }

                displayQuote() {
                    const quoteElement = document.querySelector('.quote-text');
                    const authorElement = document.querySelector('.quote-author');
                    if (quoteElement && authorElement) {
                        const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
                        quoteElement.textContent = \`"\${randomQuote.text}"\`;
                        authorElement.textContent = \`— \${randomQuote.author}\`;
                    }
                }

                updateMood() {
                    const weatherText = document.getElementById('weather-info');
                    if (weatherText) {
                        const randomMood = this.moodStates[Math.floor(Math.random() * this.moodStates.length)];
                        weatherText.textContent = \`\${randomMood.icon} \${randomMood.text}\`;
                    }
                }

                applySettings() {
                    if (this.quoteCard) this.quoteCard.style.display = this.settings.showQuoteCard ? 'block' : 'none';
                    if (this.moodCard) this.moodCard.style.display = this.settings.showMoodCard ? 'block' : 'none';
                    if (this.miniCalendar) {
                        if (this.settings.showCalendar) {
                            this.miniCalendar.classList.remove('hidden');
                            this.miniCalendar.classList.add('show');
                        } else {
                            this.miniCalendar.classList.add('hidden');
                            this.miniCalendar.classList.remove('show');
                        }
                    }
                }

                setupMiniCalendar() {
                    if (!this.miniCalendar) return;
                    const now = new Date();
                    this.currentCalendarYear = now.getFullYear();
                    this.currentCalendarMonth = now.getMonth();
                    
                    // Calendar navigation buttons
                    const prevBtn = document.getElementById('prev-month');
                    const nextBtn = document.getElementById('next-month');
                    
                    if (prevBtn) {
                        prevBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.navigateMonth(-1);
                        });
                    }
                    
                    if (nextBtn) {
                        nextBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.navigateMonth(1);
                        });
                    }
                    
                    // Add long press for memo management mode
                    let longPressTimer;
                    this.miniCalendar.addEventListener('mousedown', (e) => {
                        // Don't trigger long press on navigation buttons
                        if (e.target.closest('.calendar-nav-btn')) return;
                        
                        longPressTimer = setTimeout(() => {
                            this.toggleMemoManagementMode();
                        }, 800);
                    });

                    this.miniCalendar.addEventListener('mouseup', (e) => {
                        clearTimeout(longPressTimer);
                    });

                    this.miniCalendar.addEventListener('mouseleave', (e) => {
                        clearTimeout(longPressTimer);
                    });
                    
                    this.renderMiniCalendar(this.currentCalendarYear, this.currentCalendarMonth);
                    // Mini-calendar is controlled by settings, no need for click-outside behavior
                }

                navigateMonth(direction) {
                    this.currentCalendarMonth += direction;
                    
                    if (this.currentCalendarMonth > 11) {
                        this.currentCalendarMonth = 0;
                        this.currentCalendarYear++;
                    } else if (this.currentCalendarMonth < 0) {
                        this.currentCalendarMonth = 11;
                        this.currentCalendarYear--;
                    }
                    
                    this.renderMiniCalendar(this.currentCalendarYear, this.currentCalendarMonth);
                }

                renderMiniCalendar(year, month) {
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const monthElement = document.getElementById('mini-calendar-month');
                    const yearElement = document.getElementById('mini-calendar-year');
                    const daysElement = document.getElementById('mini-calendar-days');
                    if (!monthElement || !yearElement || !daysElement) return;
                    
                    monthElement.textContent = monthNames[month];
                    yearElement.textContent = year;
                    const firstDay = new Date(year, month, 1);
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const startingDayOfWeek = firstDay.getDay();
                    const today = new Date();
                    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
                    const todayDate = today.getDate();
                    
                    daysElement.innerHTML = '';
                    
                    // Previous month days
                    for (let i = 0; i < startingDayOfWeek; i++) {
                        const dayElement = document.createElement('div');
                        dayElement.className = 'mini-calendar-day other-month';
                        const prevMonthLastDay = new Date(year, month, 0).getDate();
                        dayElement.textContent = prevMonthLastDay - startingDayOfWeek + i + 1;
                        daysElement.appendChild(dayElement);
                    }
                    
                    // Current month days
                    for (let day = 1; day <= daysInMonth; day++) {
                        const dayElement = document.createElement('div');
                        dayElement.className = 'mini-calendar-day';
                        dayElement.textContent = day;
                        if (isCurrentMonth && day === todayDate) dayElement.classList.add('today');
                        
                        // Add memo indicator if memo exists for this date
                        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        if (this.memos[dateKey]) {
                            dayElement.classList.add('has-memo');
                            const indicator = document.createElement('div');
                            indicator.className = 'memo-indicator';
                            dayElement.appendChild(indicator);
                            
                            // Add memo preview in management mode
                            if (this.memoManagementMode) {
                                const preview = document.createElement('div');
                                preview.className = 'memo-preview';
                                preview.textContent = this.memos[dateKey].substring(0, 20) + (this.memos[dateKey].length > 20 ? '...' : '');
                                dayElement.appendChild(preview);
                            }
                        }
                        
                        // Add management mode styling
                        if (this.memoManagementMode) {
                            dayElement.classList.add('management-mode');
                        }
                        
                        // Add click handler for memo functionality
                        dayElement.addEventListener('click', (e) => {
                            e.stopPropagation();
                            if (this.memoManagementMode && this.memos[dateKey]) {
                                this.showMemoManagementModal(year, month, day, dayElement);
                            } else {
                                this.showMemoModal(year, month, day, dayElement);
                            }
                        });
                        
                        daysElement.appendChild(dayElement);
                    }
                    
                    // Next month days
                    const totalCells = daysElement.children.length;
                    for (let i = 1; totalCells + i - 1 < 35; i++) {
                        const dayElement = document.createElement('div');
                        dayElement.className = 'mini-calendar-day other-month';
                        dayElement.textContent = i;
                        daysElement.appendChild(dayElement);
                    }
                }


                showSettings() {
                    const modal = this.createSettingsModal();
                    document.body.appendChild(modal);
                    
                    // Add click-outside-to-close functionality
                    modal.addEventListener('click', (e) => {
                        if (e.target === modal) {
                            modal.remove();
                        }
                    });
                    
                    requestAnimationFrame(() => {
                        modal.classList.add('show');
                    });
                }

                setupPhotoUpload() {
                    const photoUploadInput = document.getElementById('photo-upload');
                    if (!photoUploadInput) return;

                    photoUploadInput.addEventListener('change', (e) => {
                        const file = e.target.files[0];
                        if (file && file.type.startsWith('image/')) {
                            this.processCustomPhoto(file);
                        }
                        // Reset input value to allow same file selection
                        e.target.value = '';
                    });
                }

                setupChatUpload() {
                    console.log('🚀 Setting up chat upload system...');
                    
                    // 직접 DOM에서 요소들을 찾음 (캐싱 의존하지 않음)
                    const chatUploadBtn = document.getElementById('chat-upload');
                    const chatFileInput = document.getElementById('chat-file-input');
                    
                    console.log('🎯 Chat upload button found:', !!chatUploadBtn);
                    console.log('🎯 Chat file input found:', !!chatFileInput);
                    
                    if (!chatUploadBtn || !chatFileInput) {
                        console.error('❌ Chat upload elements not found! Retrying in 500ms...');
                        // DOM이 아직 준비되지 않았다면 잠시 후 재시도
                        setTimeout(() => this.setupChatUpload(), 500);
                        return;
                    }

                    // 업로드 버튼 클릭 → 파일 선택 창 열기
                    chatUploadBtn.addEventListener('click', () => {
                        console.log('🖱️ Chat upload button clicked!');
                        chatFileInput.click();
                    });

                    // 파일 선택 완료 → 파일 처리
                    chatFileInput.addEventListener('change', (e) => {
                        console.log('📁 Chat file input change event fired!');
                        this.handleFileUpload(e);
                    });

                    // 캐싱 업데이트 (나중에 사용할 수 있도록)
                    this.chatUpload = chatUploadBtn;
                    this.chatFileInput = chatFileInput;
                    
                    console.log('✅ Chat upload system setup complete!');
                }

                processCustomPhoto(file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = new Image();
                        img.onload = () => {
                            this.compressAndSavePhoto(img, file.name);
                        };
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }

                compressAndSavePhoto(img, filename) {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Target dimensions optimized for Mac Retina displays
                    const maxWidth = 2880;  // 맥북 프로 14인치 기본 해상도
                    const maxHeight = 1800; // 16:10 비율 유지
                    
                    let { width, height } = img;
                    
                    // Calculate new dimensions maintaining aspect ratio
                    if (width > height) {
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // 고품질 렌더링 설정
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    
                    // Draw image with high quality
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert with lossless quality
                    const highQualityDataUrl = canvas.toDataURL('image/png');
                    
                    // 더 관대한 파일 크기 제한 (2MB까지 허용)
                    if (highQualityDataUrl.length > 2600000) { // ~2MB in base64
                        // 크기가 너무 큰 경우에만 압축
                        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
                        this.saveCustomPhoto(compressedDataUrl, filename);
                    } else {
                        this.saveCustomPhoto(highQualityDataUrl, filename);
                    }
                }

                saveCustomPhoto(dataUrl, filename) {
                    const photoData = {
                        id: Date.now(),
                        name: filename,
                        data: dataUrl,
                        uploadDate: new Date().toISOString()
                    };

                    // Add to custom photos array
                    this.customPhotos.unshift(photoData);
                    
                    // Limit to 5 photos to manage storage
                    if (this.customPhotos.length > 5) {
                        this.customPhotos = this.customPhotos.slice(0, 5);
                    }
                    
                    // Save to localStorage
                    localStorage.setItem('elegant-space-custom-photos', JSON.stringify(this.customPhotos));
                    
                    // Immediately use the new photo as background
                    this.setBackgroundImage({
                        url: dataUrl,
                        photographer: 'Your Photo',
                        location: filename.replace(/\.[^/.]+$/, '') // Remove file extension
                    });
                    
                    // Enable custom photos if not already
                    if (!this.settings.useCustomPhotos) {
                        this.settings.useCustomPhotos = true;
                        localStorage.setItem('elegant-space-use-custom-photos', 'true');
                    }
                }

                getRandomCustomPhoto() {
                    if (this.customPhotos.length === 0) return null;
                    
                    const randomIndex = Math.floor(Math.random() * this.customPhotos.length);
                    const photo = this.customPhotos[randomIndex];
                    
                    return {
                        url: photo.data,
                        photographer: 'Your Photo',
                        location: photo.name.replace(/\.[^/.]+$/, '')
                    };
                }

                deleteCustomPhoto(photoId) {
                    this.customPhotos = this.customPhotos.filter(photo => photo.id !== photoId);
                    localStorage.setItem('elegant-space-custom-photos', JSON.stringify(this.customPhotos));
                    
                    // If no custom photos left, disable custom photos
                    if (this.customPhotos.length === 0 && this.settings.useCustomPhotos) {
                        this.settings.useCustomPhotos = false;
                        localStorage.setItem('elegant-space-use-custom-photos', 'false');
                        this.loadBackgroundImage(true); // Load fallback image
                    }
                }

                createSettingsModal() {
                    const modal = document.createElement('div');
                    modal.className = 'settings-modal';
                    modal.innerHTML = \`
                        <div class="settings-content">
                            <div class="settings-header">
                                <div class="settings-title">
                                    <div class="settings-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    </div>
                                    <h2>Settings</h2>
                                </div>
                                <button class="close-btn" onclick="this.closest('.settings-modal').remove()">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                            <div class="settings-body">
                                <div class="setting-group">
                                    <label class="setting-label">Display Name</label>
                                    <p class="setting-description">Choose how you'd like to be greeted</p>
                                    <input type="text" value="\${this.userName}" class="setting-input" placeholder="Enter your name">
                                </div>
                                
                                <div class="setting-group">
                                    <label class="setting-label">Display Options</label>
                                    <p class="setting-description">Customize what appears on your new tab page</p>
                                    
                                    <div class="setting-item toggle-item">
                                        <label class="toggle-label">
                                            <span>Daily Inspiration Card</span>
                                            <div class="toggle-switch">
                                                <input type="checkbox" \${this.settings.showQuoteCard ? 'checked' : ''} class="quote-toggle">
                                                <span class="toggle-slider"></span>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div class="setting-item toggle-item">
                                        <label class="toggle-label">
                                            <span>Today's Mood Card</span>
                                            <div class="toggle-switch">
                                                <input type="checkbox" \${this.settings.showMoodCard ? 'checked' : ''} class="mood-toggle">
                                                <span class="toggle-slider"></span>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div class="setting-item toggle-item">
                                        <label class="toggle-label">
                                            <span>Calendar Widget</span>
                                            <div class="toggle-switch">
                                                <input type="checkbox" \${this.settings.showCalendar ? 'checked' : ''} class="calendar-toggle">
                                                <span class="toggle-slider"></span>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div class="setting-item toggle-item">
                                        <label class="toggle-label">
                                            <span>Use Custom Photos</span>
                                            <div class="toggle-switch">
                                                <input type="checkbox" \${this.settings.useCustomPhotos ? 'checked' : ''} class="custom-photos-toggle">
                                                <span class="toggle-slider"></span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                
                                <div class="setting-group">
                                    <label class="setting-label">Custom Photos (\${this.customPhotos.length}/5)</label>
                                    <p class="setting-description">Manage your uploaded background images</p>
                                    <div class="custom-photos-list" id="custom-photos-list">
                                        \${this.customPhotos.map(photo => \`
                                            <div class="photo-item" data-photo-id="\${photo.id}">
                                                <div class="photo-thumbnail" style="background-image: url(\${photo.data})"></div>
                                                <div class="photo-info">
                                                    <span class="photo-name">\${photo.name}</span>
                                                    <span class="photo-date">\${new Date(photo.uploadDate).toLocaleDateString()}</span>
                                                </div>
                                                <button class="delete-photo-btn" data-photo-id="\${photo.id}">×</button>
                                            </div>
                                        \`).join('')}
                                        \${this.customPhotos.length === 0 ? '<p class="no-photos">No custom photos uploaded yet. Use the camera button to add photos.</p>' : ''}
                                    </div>
                                </div>
                                
                            </div>
                            <button class="save-btn save-settings">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                    <polyline points="17,21 17,13 7,13 7,21"/>
                                    <polyline points="7,3 7,8 15,8"/>
                                </svg>
                            </button>
                        </div>
                    \`;

                    const styles = document.createElement('style');
                    styles.textContent = \`
                        .setting-item {
                            margin-bottom: 1.5rem;
                        }
                        .setting-item label {
                            display: block;
                            color: rgba(255, 255, 255, 0.8);
                            margin-bottom: 0.5rem;
                            font-weight: 500;
                        }
                        .name-setting {
                            width: 100%;
                            background: rgba(255, 255, 255, 0.1);
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            border-radius: 12px;
                            padding: 0.75rem 1rem;
                            color: white;
                            font-size: 1rem;
                            outline: none;
                            transition: all 0.2s ease;
                        }
                        .name-setting:focus { border-color: #6366f1; background: rgba(255, 255, 255, 0.15); }
                        
                        .setting-section {
                            margin: 1.5rem 0;
                            padding-top: 1.5rem;
                            border-top: 1px solid rgba(255, 255, 255, 0.1);
                        }
                        
                        .section-title {
                            font-size: 1rem;
                            font-weight: 600;
                            color: var(--text-primary);
                            margin-bottom: 1rem;
                        }
                        
                        .toggle-item {
                            margin-bottom: 1rem;
                        }
                        
                        .toggle-label {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            color: rgba(255, 255, 255, 0.8);
                            font-weight: 400;
                            cursor: pointer;
                        }
                        
                        .toggle-switch {
                            position: relative;
                            width: 48px;
                            height: 24px;
                        }
                        
                        .toggle-switch input {
                            opacity: 0;
                            width: 0;
                            height: 0;
                        }
                        
                        .toggle-slider {
                            position: absolute;
                            cursor: pointer;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: rgba(255, 255, 255, 0.2);
                            transition: 0.3s;
                            border-radius: 24px;
                        }
                        
                        .toggle-slider:before {
                            position: absolute;
                            content: "";
                            height: 18px;
                            width: 18px;
                            left: 3px;
                            bottom: 3px;
                            background-color: white;
                            transition: 0.3s;
                            border-radius: 50%;
                        }
                        
                        .toggle-switch input:checked + .toggle-slider {
                            background: #6366f1;
                        }
                        
                        .toggle-switch input:checked + .toggle-slider:before {
                            transform: translateX(24px);
                        }
                    \`;
                    modal.appendChild(styles);
                    
                    // Add event listeners
                    setTimeout(() => {
                        const saveBtn = modal.querySelector('.save-settings');
                        const nameInput = modal.querySelector('.name-setting');
                        const quoteToggle = modal.querySelector('.quote-toggle');
                        const moodToggle = modal.querySelector('.mood-toggle');
                        const calendarToggle = modal.querySelector('.calendar-toggle');
                        const customPhotosToggle = modal.querySelector('.custom-photos-toggle');
                        
                        // Handle photo deletion
                        modal.querySelectorAll('.delete-photo-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                const photoId = parseInt(e.target.getAttribute('data-photo-id'));
                                this.deleteCustomPhoto(photoId);
                                modal.remove();
                                setTimeout(() => this.showSettings(), 100); // Refresh settings modal
                            });
                        });
                        
                        saveBtn?.addEventListener('click', () => {
                            // Save name
                            if (nameInput?.value.trim()) {
                                this.userName = nameInput.value.trim();
                                localStorage.setItem('elegant-space-username', this.userName);
                                this.updateGreetingDisplay();
                            }
                            
                            // Save settings
                            this.settings.showQuoteCard = quoteToggle?.checked ?? true;
                            this.settings.showMoodCard = moodToggle?.checked ?? true;
                            this.settings.showCalendar = calendarToggle?.checked ?? false;
                            this.settings.useCustomPhotos = customPhotosToggle?.checked ?? false;
                            
                            localStorage.setItem('elegant-space-show-quote', this.settings.showQuoteCard);
                            localStorage.setItem('elegant-space-show-mood', this.settings.showMoodCard);
                            localStorage.setItem('elegant-space-show-calendar', this.settings.showCalendar);
                            localStorage.setItem('elegant-space-use-custom-photos', this.settings.useCustomPhotos);
                            
                            this.applySettings();
                            modal.remove();
                            
                            // Refresh background if custom photos setting changed
                            this.loadBackgroundImage(true);
                        });
                    }, 100);

                    return modal;
                }
                
                showMemoModal(year, month, day, dayElement) {
                    // Close any existing memo popup first
                    const existingPopup = document.querySelector('.memo-popup');
                    if (existingPopup) {
                        existingPopup.remove();
                    }
                    
                    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const existingMemo = this.memos[dateKey] || '';
                    
                    const modal = document.createElement('div');
                    modal.className = 'memo-popup';
                    modal.innerHTML = `
                        <div class="memo-popup-arrow"></div>
                        <div class="memo-popup-content">
                            <div class="memo-header">
                                <span class="memo-date">${day} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month]}</span>
                                <button class="memo-close" type="button">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                            <div class="memo-input-container">
                                <textarea 
                                    class="memo-input" 
                                    placeholder="Write a memo..."
                                    maxlength="150"
                                    rows="2"
                                >${existingMemo}</textarea>
                            </div>
                            <div class="memo-actions">
                                <span class="memo-count">${existingMemo.length}/150</span>
                                <div class="memo-buttons">
                                    ${existingMemo ? '<button class="memo-delete" type="button">Delete</button>' : ''}
                                    <button class="memo-save" type="button">Save</button>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    // Position popup directly above the clicked date
                    const rect = dayElement.getBoundingClientRect();
                    document.body.appendChild(modal);
                    
                    const popupRect = modal.getBoundingClientRect();
                    let left = rect.left + rect.width / 2 - popupRect.width / 2;
                    let top = rect.top - popupRect.height - 8;
                    
                    // Adjust horizontal position if goes off screen
                    if (left < 8) {
                        left = 8;
                        modal.querySelector('.memo-popup-arrow').style.left = (rect.left + rect.width / 2 - 8) + 'px';
                    } else if (left + popupRect.width > window.innerWidth - 8) {
                        left = window.innerWidth - popupRect.width - 8;
                        modal.querySelector('.memo-popup-arrow').style.left = (rect.left + rect.width / 2 - left - 8) + 'px';
                    }
                    
                    // If popup goes above viewport, show below date
                    if (top < 8) {
                        top = rect.bottom + 8;
                        modal.classList.add('below');
                    }
                    
                    modal.style.left = left + 'px';
                    modal.style.top = top + 'px';
                    
                    // Focus textarea
                    const textarea = modal.querySelector('.memo-input');
                    setTimeout(() => textarea.focus(), 100);
                    
                    // Character counter and input enhancements
                    const charCount = modal.querySelector('.memo-count');
                    const inputContainer = modal.querySelector('.memo-input-container');
                    const inputBorder = modal.querySelector('.memo-input-border');
                    
                    textarea.addEventListener('input', () => {
                        charCount.textContent = textarea.value.length + '/300';
                        
                        // Auto-resize textarea
                        textarea.style.height = 'auto';
                        textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
                    });
                    
                    textarea.addEventListener('focus', () => {
                        inputContainer.classList.add('focused');
                    });
                    
                    textarea.addEventListener('blur', () => {
                        inputContainer.classList.remove('focused');
                    });
                    
                    // Event listeners
                    const closeBtn = modal.querySelector('.memo-close');
                    const saveBtn = modal.querySelector('.memo-save');
                    const deleteBtn = modal.querySelector('.memo-delete');
                    
                    closeBtn?.addEventListener('click', () => modal.remove());
                    
                    // Close on clicking header or actions area (but not input)
                    const header = modal.querySelector('.memo-header');
                    const actions = modal.querySelector('.memo-actions');
                    
                    header?.addEventListener('click', (e) => {
                        if (e.target === header || e.target.closest('.memo-date')) {
                            modal.remove();
                        }
                    });
                    
                    actions?.addEventListener('click', (e) => {
                        if (e.target === actions || e.target.closest('.memo-count')) {
                            modal.remove();
                        }
                    });
                    
                    // Close on outside click
                    document.addEventListener('click', (e) => {
                        if (!modal.contains(e.target) && e.target !== dayElement) {
                            modal.remove();
                        }
                    }, { once: true });
                    
                    // Save memo
                    saveBtn?.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const memoText = textarea.value.trim();
                        if (memoText) {
                            this.memos[dateKey] = memoText;
                        } else {
                            delete this.memos[dateKey];
                        }
                        localStorage.setItem('elegant-space-memos', JSON.stringify(this.memos));
                        
                        // Update calendar display
                        this.renderMiniCalendar(year, month);
                        modal.remove();
                    });
                    
                    // Delete memo
                    deleteBtn?.addEventListener('click', (e) => {
                        e.stopPropagation();
                        delete this.memos[dateKey];
                        localStorage.setItem('elegant-space-memos', JSON.stringify(this.memos));
                        
                        // Update calendar display
                        this.renderMiniCalendar(year, month);
                        modal.remove();
                    });
                    
                    // Close with Escape key
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape' && modal.parentNode) {
                            modal.remove();
                        }
                    }, { once: true });
                    
                    requestAnimationFrame(() => {
                        modal.classList.add('show');
                    });
                }

                toggleMemoManagementMode() {
                    this.memoManagementMode = !this.memoManagementMode;
                    
                    if (this.memoManagementMode) {
                        this.miniCalendar.style.border = '2px solid rgba(239, 68, 68, 0.5)';
                        this.miniCalendar.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
                        // Add visual feedback
                        const tooltip = document.createElement('div');
                        tooltip.className = 'management-tooltip';
                        tooltip.textContent = '메모 관리 모드 ON - 캘린더를 다시 길게 눌러서 해제';
                        document.body.appendChild(tooltip);
                        setTimeout(() => tooltip.remove(), 3000);
                    } else {
                        this.miniCalendar.style.border = '';
                        this.miniCalendar.style.backgroundColor = '';
                    }
                    
                    // Re-render calendar to update display
                    const now = new Date();
                    this.renderMiniCalendar(now.getFullYear(), now.getMonth());
                }

                showMemoManagementModal(year, month, day, dayElement) {
                    const dateKey = \`\${year}-\${String(month + 1).padStart(2, '0')}-\${String(day).padStart(2, '0')}\`;
                    const memo = this.memos[dateKey];
                    if (!memo) return;

                    // Remove any existing modals
                    const existingModal = document.querySelector('.memo-popup');
                    if (existingModal) {
                        existingModal.remove();
                    }

                    // Create management modal
                    const modal = document.createElement('div');
                    modal.className = 'memo-popup management-popup';
                    
                    // Calculate position
                    const dayRect = dayElement.getBoundingClientRect();
                    const modalWidth = 250;
                    const modalHeight = 180;
                    
                    let left = dayRect.left + (dayRect.width / 2) - (modalWidth / 2);
                    let top = dayRect.top - modalHeight - 10;
                    
                    // Adjust if modal goes off screen
                    if (left < 10) left = 10;
                    if (left + modalWidth > window.innerWidth - 10) left = window.innerWidth - modalWidth - 10;
                    if (top < 10) top = dayRect.bottom + 10;
                    
                    modal.style.left = \`\${left}px\`;
                    modal.style.top = \`\${top}px\`;

                    const modalContent = \`
                        <div class="memo-popup-content management-content">
                            <div class="memo-header">
                                <span class="memo-date">\${month + 1}/\${day} 메모</span>
                            </div>
                            <div class="memo-preview-full">\${memo}</div>
                            <div class="memo-actions management-actions">
                                <button class="memo-btn edit-btn">편집</button>
                                <button class="memo-btn delete-btn">삭제</button>
                                <button class="memo-btn export-btn">내보내기</button>
                            </div>
                        </div>
                    \`;

                    modal.innerHTML = modalContent;
                    document.body.appendChild(modal);

                    // Event handlers
                    const editBtn = modal.querySelector('.edit-btn');
                    const deleteBtn = modal.querySelector('.delete-btn');
                    const exportBtn = modal.querySelector('.export-btn');

                    editBtn?.addEventListener('click', (e) => {
                        e.stopPropagation();
                        modal.remove();
                        this.showMemoModal(year, month, day, dayElement);
                    });

                    deleteBtn?.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (confirm(\`\${month + 1}/\${day} 메모를 삭제하시겠습니까?\`)) {
                            delete this.memos[dateKey];
                            localStorage.setItem('elegant-space-memos', JSON.stringify(this.memos));
                            this.renderMiniCalendar(year, month);
                        }
                        modal.remove();
                    });

                    exportBtn?.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const text = \`\${year}-\${String(month + 1).padStart(2, '0')}-\${String(day).padStart(2, '0')}: \${memo}\`;
                        navigator.clipboard.writeText(text).then(() => {
                            const toast = document.createElement('div');
                            toast.className = 'management-tooltip';
                            toast.textContent = '메모가 클립보드에 복사되었습니다';
                            document.body.appendChild(toast);
                            setTimeout(() => toast.remove(), 2000);
                        });
                    });

                    // Close modal when clicking outside
                    setTimeout(() => {
                        document.addEventListener('click', (e) => {
                            if (!modal.contains(e.target)) {
                                modal.remove();
                            }
                        }, { once: true });
                    }, 100);

                    requestAnimationFrame(() => {
                        modal.classList.add('show');
                    });
                }

                // Chat functionality methods
                toggleChat() {
                    if (this.isChatOpen) {
                        this.closeChat();
                    } else {
                        this.openChat();
                    }
                }

                openChat() {
                    if (!this.chatPanel) return;
                    
                    this.isChatOpen = true;
                    this.chatPanel.classList.add('active');
                    
                    // Focus on input after animation
                    setTimeout(() => {
                        if (this.chatInput) {
                            this.chatInput.focus();
                        }
                    }, 200);
                }

                closeChat() {
                    if (!this.chatPanel) return;
                    
                    this.isChatOpen = false;
                    this.chatPanel.classList.remove('active');
                    
                    if (this.chatInput) {
                        this.chatInput.blur();
                    }
                }

                async sendMessage() {
                    if (!this.chatInput || !this.chatMessages) return;
                    
                    const message = this.chatInput.value.trim();
                    if (!message) return;
                    
                    // Clear input and disable send button
                    this.chatInput.value = '';
                    this.chatSendBtn.disabled = true;
                    
                    // Clear uploaded files after sending
                    this.chatUploadedFiles = [];
                    this.updateFileDisplay();
                    
                    // Add user message
                    this.addChatMessage(message, 'user');
                    
                    // Show typing indicator
                    this.showTypingIndicator();
                    
                    try {
                        // Send to Gemini API
                        const response = await this.sendToGemini(message);
                        
                        // Remove typing indicator
                        this.hideTypingIndicator();
                        
                        // Add AI response
                        this.addChatMessage(response, 'ai');
                    } catch (error) {
                        console.error('Chat error:', error);
                        
                        // Remove typing indicator
                        this.hideTypingIndicator();
                        
                        // Add error message
                        this.addChatMessage('Sorry, I encountered an error. Please try again.', 'ai');
                    } finally {
                        // Re-enable send button
                        this.chatSendBtn.disabled = false;
                    }
                }

                addChatMessage(content, sender) {
                    if (!this.chatMessages) return;
                    
                    // Remove welcome message if it exists
                    const welcomeMessage = this.chatMessages.querySelector('.chat-welcome');
                    if (welcomeMessage) {
                        welcomeMessage.remove();
                    }
                    
                    const messageElement = document.createElement('div');
                    messageElement.className = \`chat-message \${sender}\`;
                    
                    const avatarSvg = sender === 'user' 
                        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
                        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>';
                    
                    messageElement.innerHTML = \`
                        <div class="message-avatar \${sender}">
                            \${avatarSvg}
                        </div>
                        <div class="message-content">
                            \${content}
                        </div>
                    \`;
                    
                    this.chatMessages.appendChild(messageElement);
                    this.scrollToBottom();
                }

                showTypingIndicator() {
                    if (!this.chatMessages) return;
                    
                    const typingElement = document.createElement('div');
                    typingElement.className = 'chat-message ai typing-message';
                    typingElement.innerHTML = \`
                        <div class="message-avatar ai">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                            </svg>
                        </div>
                        <div class="message-content">
                            <div class="message-typing">
                                <div class="typing-dot"></div>
                                <div class="typing-dot"></div>
                                <div class="typing-dot"></div>
                            </div>
                        </div>
                    \`;
                    
                    this.chatMessages.appendChild(typingElement);
                    this.scrollToBottom();
                    this.isTyping = true;
                }

                hideTypingIndicator() {
                    if (!this.chatMessages) return;
                    
                    const typingMessage = this.chatMessages.querySelector('.typing-message');
                    if (typingMessage) {
                        typingMessage.remove();
                    }
                    this.isTyping = false;
                }

                scrollToBottom() {
                    if (!this.chatMessages) return;
                    
                    requestAnimationFrame(() => {
                        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
                    });
                }

                resetChat() {
                    if (!this.chatMessages) return;
                    
                    // Clear all messages except welcome
                    this.chatMessages.innerHTML = \`
                        <div class="chat-welcome">
                            <div class="welcome-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                            </div>
                            <h3>Hello! I'm your AI assistant</h3>
                            <p>I can help you with questions, searches, and information from the web. What would you like to know?</p>
                        </div>
                    \`;
                    
                    // Clear uploaded files
                    this.chatUploadedFiles = [];
                    this.updateFileDisplay();
                    
                    // Chat reset - no tooltip needed
                }

                handleFileUpload(event) {
                    console.log('🔥 File upload event triggered:', event);
                    
                    const files = Array.from(event.target.files);
                    console.log('📁 Files selected:', files.length, files.map(f => f.name));
                    
                    if (!files.length) {
                        console.log('⚠️ No files selected');
                        return;
                    }
                    
                    // Add files to uploaded files array
                    files.forEach(file => {
                        console.log(\`📄 Processing file: \${file.name} (\${(file.size / 1024 / 1024).toFixed(2)}MB, \${file.type})\`);
                        
                        // Check file size (max 100MB based on Gemini API 2025 limits)
                        if (file.size > 100 * 1024 * 1024) {
                            console.error(\`❌ File too large: \${file.name}\`);
                            alert(\`File \${file.name} is too large (max 100MB)\`);
                            return;
                        }
                        
                        // Expanded file type support based on Gemini API 2025 capabilities
                        const allowedTypes = [
                            'image/', 'video/', 'audio/', 
                            'application/pdf', 'text/', 
                            'application/msword', 
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'application/vnd.ms-excel',
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        ];
                        const isAllowedType = allowedTypes.some(type => file.type.startsWith(type));
                        
                        if (!isAllowedType) {
                            console.error(\`❌ Unsupported file type: \${file.type}\`);
                            alert(\`File type \${file.type} not supported\`);
                            return;
                        }
                        
                        this.chatUploadedFiles.push(file);
                        console.log(\`✅ File added: \${file.name}\`);
                    });
                    
                    console.log(\`📊 Total files now: \${this.chatUploadedFiles.length}\`);
                    this.updateFileDisplay();
                    
                    // Auto-open chat if files selected
                    if (this.chatUploadedFiles.length > 0 && !this.isChatOpen) {
                        console.log('🚀 Auto-opening chat due to file upload');
                        this.openChat();
                    }
                    
                    // Clear input
                    event.target.value = '';
                }

                updateFileDisplay() {
                    if (!this.fileNamesSpan) {
                        console.warn('File names span element not found, retrying...');
                        this.fileNamesSpan = document.getElementById('file-names');
                        if (!this.fileNamesSpan) {
                            console.error('Could not find file-names element');
                            return;
                        }
                    }
                    
                    if (this.chatUploadedFiles.length > 0) {
                        this.chatUpload?.classList.add('has-files');
                        const fileNames = this.chatUploadedFiles.map(f => {
                            const name = f.name.length > 15 ? f.name.substring(0, 12) + '...' : f.name;
                            return name;
                        }).join(', ');
                        
                        this.fileNamesSpan.textContent = \`\${this.chatUploadedFiles.length} file(s): \${fileNames}\`;
                    } else {
                        this.chatUpload?.classList.remove('has-files');
                        this.fileNamesSpan.textContent = '';
                    }
                }

                // Complex preview system removed - showFilePreview() {
                    // Remove existing preview
                    const existingPreview = document.querySelector('.file-preview');
                    if (existingPreview) {
                        existingPreview.remove();
                    }
                    
                    if (this.chatUploadedFiles.length === 0) return;
                    
                    const previewContainer = document.createElement('div');
                    previewContainer.className = 'file-preview';
                    
                    this.chatUploadedFiles.forEach((file, index) => {
                        const fileItem = document.createElement('div');
                        fileItem.className = 'file-item';
                        
                        const fileName = file.name.length > 25 ? file.name.substring(0, 22) + '...' : file.name;
                        const fileSize = (file.size / 1024).toFixed(1) + 'KB';
                        
                        // Choose icon based on file type
                        let iconSvg = '';
                        if (file.type.startsWith('image/')) {
                            iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>';
                        } else if (file.type === 'application/pdf') {
                            iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>';
                        } else {
                            iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';
                        }
                        
                        fileItem.innerHTML = \`
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14,2 14,8 20,8"/>
                            </svg>
                            <span>\${fileName} (\${fileSize})</span>
                            <button class="file-remove" onclick="window.elegantSpace.removeFile(\${index})">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        \`;
                        
                        previewContainer.appendChild(fileItem);
                    });
                    
                    // Insert preview before input wrapper
                    const inputContainer = document.querySelector('.chat-input-container');
                    const inputWrapper = document.querySelector('.chat-input-wrapper');
                    if (inputContainer && inputWrapper) {
                        inputContainer.insertBefore(previewContainer, inputWrapper);
                        console.log('File preview inserted successfully');
                    } else {
                        console.log('Could not find input container or wrapper for file preview');
                        // If chat is not open, force open it to show preview
                        if (!this.isChatOpen) {
                            console.log('Opening chat to show file preview');
                            this.toggleChat();
                            // Retry after a short delay
                            setTimeout(() => {
                                const retryContainer = document.querySelector('.chat-input-container');
                                const retryWrapper = document.querySelector('.chat-input-wrapper');
                                if (retryContainer && retryWrapper) {
                                    retryContainer.insertBefore(previewContainer, retryWrapper);
                                    console.log('File preview inserted after opening chat');
                                }
                            }, 100);
                        }
                    }
                }

                removeFile(index) {
                    this.chatUploadedFiles.splice(index, 1);
                    this.updateFileDisplay();
                }

                async convertFileToBase64(file) {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const result = reader.result;
                            if (result && typeof result === 'string') {
                                const base64Data = result.split(',')[1];
                                console.log(\`📊 Base64 conversion success for \${file.name}: \${base64Data.length} chars\`);
                                resolve(base64Data);
                            } else {
                                console.error('❌ Base64 conversion failed - invalid result type');
                                reject(new Error('Base64 conversion failed'));
                            }
                        };
                        reader.onerror = (error) => {
                            console.error('❌ FileReader error:', error);
                            reject(error);
                        };
                        reader.readAsDataURL(file);
                    });
                }

                async fileToGenerativePart(file) {
                    console.log(\`🔄 Converting file to generative part: \${file.name} (\${file.type})\`);
                    
                    const base64Data = await this.convertFileToBase64(file);
                    
                    const generativePart = {
                        inlineData: {
                            data: base64Data,
                            mimeType: file.type
                        }
                    };
                    
                    console.log(\`✅ Generative part created for \${file.name}:\`, {
                        mimeType: generativePart.inlineData.mimeType,
                        dataLength: generativePart.inlineData.data.length
                    });
                    
                    return generativePart;
                }

                async sendToGemini(message) {
                    if (!this.geminiApiKey) {
                        throw new Error('Gemini API key not configured');
                    }

                    const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=\${this.geminiApiKey}\`;
                    
                    const parts = [{ text: message }];
                    
                    // Add uploaded files using the proven working pattern
                    if (this.chatUploadedFiles.length > 0) {
                        console.log('🔄 Processing uploaded files using proven pattern...');
                        
                        for (const file of this.chatUploadedFiles) {
                            console.log(\`📄 Processing: \${file.name} (\${file.type}, \${(file.size / 1024 / 1024).toFixed(2)}MB)\`);
                            
                            try {
                                // Use the proven fileToGenerativePart pattern (like Firebase/Vercel examples)
                                const generativePart = await this.fileToGenerativePart(file);
                                parts.push(generativePart);
                                console.log(\`✅ File successfully added: \${file.name}\`);
                            } catch (error) {
                                console.error(\`❌ Failed to process \${file.name}:\`, error);
                                // Show user-friendly error
                                alert(\`Failed to process file: \${file.name}. Error: \${error.message}\`);
                            }
                        }
                    }
                    
                    console.log(\`📊 Total parts in request: \${parts.length}\`);
                    
                    // Log parts structure for debugging
                    parts.forEach((part, index) => {
                        if (part.text) {
                            console.log(\`📝 Part \${index}: text message (\${part.text.length} chars)\`);
                        } else if (part.inlineData) {
                            console.log(\`📁 Part \${index}: file data (\${part.inlineData.mimeType}, \${part.inlineData.data.length} chars)\`);
                        }
                    });
                    
                    const requestBody = {
                        contents: [{
                            parts: parts
                        }],
                        tools: [
                            {
                                googleSearch: {}
                            }
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 32,
                            topP: 1,
                            maxOutputTokens: 8192, // Increased for 2025 API limits
                        },
                        safetySettings: [
                            {
                                category: "HARM_CATEGORY_HARASSMENT",
                                threshold: "BLOCK_MEDIUM_AND_ABOVE"
                            },
                            {
                                category: "HARM_CATEGORY_HATE_SPEECH",
                                threshold: "BLOCK_MEDIUM_AND_ABOVE"
                            },
                            {
                                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                                threshold: "BLOCK_MEDIUM_AND_ABOVE"
                            },
                            {
                                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                                threshold: "BLOCK_MEDIUM_AND_ABOVE"
                            }
                        ]
                    };

                    console.log('🚀 Making API request...');
                    console.log('📋 Request body structure:', {
                        contentsLength: requestBody.contents.length,
                        partsLength: requestBody.contents[0].parts.length,
                        hasTools: !!requestBody.tools,
                        hasGenerationConfig: !!requestBody.generationConfig
                    });

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody)
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('❌ Gemini API error:', response.status, errorText);
                        throw new Error(\`HTTP \${response.status}: \${errorText}\`);
                    }

                    const data = await response.json();
                    console.log('📨 API response received:', data);
                    
                    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                        const responseText = data.candidates[0].content.parts[0].text;
                        console.log('✅ Response text extracted');
                        return responseText;
                    } else {
                        console.error('❌ Invalid response format:', data);
                        throw new Error('Invalid response format from Gemini API');
                    }
                }
            }

            new ElegantSpace();
        \`;
        document.body.appendChild(script);
    }

    if (isNewTabPage()) {
        setTimeout(loadElegantSpace, 100);
    }
}