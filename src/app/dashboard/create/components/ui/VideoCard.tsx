/**
 * @purpose: Re-export VideoCard depuis _shared (évite duplication)
 * @domain: video
 * @scope: local
 * @different-from: _shared/business/video-card.component.tsx
 * @why-different: Simple re-export pour compatibilité imports Create
 * @created: 2024-08-23
 */

export { VideoCard, type VideoData } from '@/_shared'