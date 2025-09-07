import React, { useState } from 'react';
import { useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Search, Filter } from 'lucide-react';
import { apiService } from '../services/api';

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  image: string;
  specifications: string[];
}

const products: Product[] = [
  {
    id: '1',
    name: 'Mirror Glass',
    category: 'Mirrors',
    description: 'High-quality silvered mirror glass with crystal-clear reflection',
    basePrice: 15,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjhmOWZhIi8+CjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjMyMCIgaGVpZ2h0PSIyMjAiIGZpbGw9InVybCgjbWlycm9yQmFzZSkiIHN0cm9rZT0iIzM3NDE1MSIgc3Ryb2tlLXdpZHRoPSIzIiByeD0iOCIvPgo8cmVjdCB4PSI1MCIgeT0iNTAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI21pcnJvclN1cmZhY2UpIiByeD0iNCIvPgo8ZWxsaXBzZSBjeD0iMTIwIiBjeT0iMTAwIiByeD0iMjAiIHJ5PSIzMCIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4zIi8+CjxlbGxpcHNlIGN4PSIyODAiIGN5PSIxODAiIHJ4PSIxNSIgcnk9IjI1IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjIiLz4KPHJlY3QgeD0iMTgwIiB5PSIxMzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuNCIgcng9IjQiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0ibWlycm9yQmFzZSIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZTVlN2ViIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2QxZDVkYiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9Im1pcnJvclN1cmZhY2UiIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2Y5ZmFmYiIvPgo8c3RvcCBvZmZzZXQ9IjMwJSIgc3RvcC1jb2xvcj0iI2VkZWZmMSIvPgo8c3RvcCBvZmZzZXQ9IjcwJSIgc3RvcC1jb2xvcj0iI2U1ZTdlYiIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNkMWQ1ZGIiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4=',
    specifications: ['6mm thickness', 'Silvered backing', 'Polished edges', 'Moisture resistant']
  },
  {
    id: '2',
    name: 'Window Glass',
    category: 'Windows',
    description: 'Clear float glass perfect for windows and architectural applications',
    basePrice: 12,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjhmOWZhIi8+CjxyZWN0IHg9IjYwIiB5PSI0MCIgd2lkdGg9IjI4MCIgaGVpZ2h0PSIyMjAiIGZpbGw9InVybCgjd2luZG93RnJhbWUpIiBzdHJva2U9IiM2YjczODAiIHN0cm9rZS13aWR0aD0iNCIgcng9IjgiLz4KPHJlY3QgeD0iNzAiIHk9IjUwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCN3aW5kb3dHbGFzcykiIHJ4PSI0Ii8+CjxsaW5lIHgxPSIyMDAiIHkxPSI1MCIgeDI9IjIwMCIgeTI9IjI1MCIgc3Ryb2tlPSIjNmI3MzgwIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuMyIvPgo8bGluZSB4MT0iNzAiIHkxPSIxNTAiIHgyPSIzMzAiIHkyPSIxNTAiIHN0cm9rZT0iIzZiNzM4MCIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz4KPGNpcmNsZSBjeD0iMTMwIiBjeT0iMTAwIiByPSIzIiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjYiLz4KPGNpcmNsZSBjeD0iMjcwIiBjeT0iMjAwIiByPSIyIiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjQiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0id2luZG93RnJhbWUiIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2Y5ZmFmYiIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJ3aW5kb3dHbGFzcyIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjEiLz4KPHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMDUiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjEiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4=',
    specifications: ['4mm thickness', 'Float glass', 'UV protection', 'Thermal resistant']
  },
  {
    id: '3',
    name: 'Tempered Glass',
    category: 'Safety',
    description: 'Heat-treated safety glass with enhanced strength and durability',
    basePrice: 25,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjhmOWZhIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjdGVtcGVyZWRHbGFzcykiIHN0cm9rZT0iIzM3NDE1MSIgc3Ryb2tlLXdpZHRoPSI0IiByeD0iNiIvPgo8cGF0aCBkPSJNNzAgNzBMMTAwIDEwME05MCA3MEwxMjAgMTAwTTExMCA3MEwxNDAgMTAwTTEzMCA3MEwxNjAgMTAwTTE1MCA3MEwxODAgMTAwTTE3MCA3MEwyMDAgMTAwTTE5MCA3MEwyMjAgMTAwTTIxMCA3MEwyNDAgMTAwTTIzMCA3MEwyNjAgMTAwTTI1MCA3MEwyODAgMTAwTTI3MCA3MEwzMDAgMTAwIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4zIi8+CjxwYXRoIGQ9Ik03MCAyMDBMMTAwIDE3ME05MCAyMDBMMTIwIDE3ME0xMTAgMjAwTDE0MCAxNzBNMTMwIDIwMEwxNjAgMTcwTTE1MCAyMDBMMTgwIDE3ME0xNzAgMjAwTDIwMCAxNzBNMTkwIDIwMEwyMjAgMTcwTTIxMCAyMDBMMjQwIDE3ME0yMzAgMjAwTDI2MCAxNzBNMjUwIDIwMEwyODAgMTcwTTI3MCAyMDBMMzAwIDE3MCIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMyIvPgo8Y2lyY2xlIGN4PSIzMjAiIGN5PSI3MCIgcj0iMTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0zMTUgNzBMMzIwIDc1TDMyNSA3MCIgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPHRleHQgeD0iMzEwIiB5PSI5NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMTBiOTgxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TQUZFVFK8L3RleHQ+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InRlbXBlcmVkR2xhc3MiIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4xNSIvPgo8c3RvcCBvZmZzZXQ9IjUwJSiIHN0b3AtY29sb3I9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMDgiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjEyIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+',
    specifications: ['8mm thickness', 'Safety certified', 'Heat resistant', 'Shatterproof']
  },
  {
    id: '4',
    name: 'Frosted Glass',
    category: 'Decorative',
    description: 'Elegant frosted glass for privacy and decorative applications',
    basePrice: 18,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjhmOWZhIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjZnJvc3RlZEJhc2UpIiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iMyIgcng9IjYiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI4IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjQiLz4KPGNpcmNsZSBjeD0iMTUwIiBjeT0iMTMwIiByPSI2IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjMiLz4KPGNpcmNsZSBjeD0iMjAwIiBjeT0iOTAiIHI9IjEwIiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjUiLz4KPGNpcmNsZSBjeD0iMjUwIiBjeT0iMTYwIiByPSI3IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjM1Ii8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjEyMCIgcj0iOSIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC40NSIvPgo8Y2lyY2xlIGN4PSIxMjAiIGN5PSIxODAiIHI9IjUiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMjUiLz4KPGNpcmNsZSBjeD0iMjgwIiBjeT0iMjAwIiByPSI4IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjQiLz4KPGVsbGlwc2UgY3g9IjE4MCIgY3k9IjIwMCIgcng9IjE1IiByeT0iOCIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4zIi8+CjxlbGxpcHNlIGN4PSIyMjAiIGN5PSIxMjAiIHJ4PSIxMiIgcnk9IjYiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMzUiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZnJvc3RlZEJhc2UiIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2Y5ZmFmYiIgb3BhY2l0eT0iMC44Ii8+CjxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjZjNmNGY2IiBvcGFjaXR5PSIwLjkiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZTVlN2ViIiBvcGFjaXR5PSIwLjg1Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+',
    specifications: ['5mm thickness', 'Acid etched', 'Privacy glass', 'Easy to clean']
  },
  {
    id: '5',
    name: 'Laminated Glass',
    category: 'Safety',
    description: 'Multi-layer safety glass with interlayer for enhanced security',
    basePrice: 30,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjhmOWZhIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjbGFtaW5hdGVkTGF5ZXIxKSIgc3Ryb2tlPSIjMzc0MTUxIiBzdHJva2Utd2lkdGg9IjMiIHJ4PSI2Ii8+CjxyZWN0IHg9IjU1IiB5PSI1NSIgd2lkdGg9IjI5MCIgaGVpZ2h0PSI5MCIgZmlsbD0idXJsKCNsYW1pbmF0ZWRMYXllcjIpIiBvcGFjaXR5PSIwLjMiLz4KPHJlY3QgeD0iNTUiIHk9IjE0NSIgd2lkdGg9IjI5MCIgaGVpZ2h0PSI4IiBmaWxsPSIjNjM2NmYxIiBvcGFjaXR5PSIwLjYiLz4KPHJlY3QgeD0iNTUiIHk9IjE1MyIgd2lkdGg9IjI5MCIgaGVpZ2h0PSI5MiIgZmlsbD0idXJsKCNsYW1pbmF0ZWRMYXllcjMpIiBvcGFjaXR5PSIwLjMiLz4KPGxpbmUgeDE9IjgwIiB5MT0iMTQ5IiB4Mj0iMzIwIiB5Mj0iMTQ5IiBzdHJva2U9IiM2MzY2ZjEiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC44IiBzdHJva2UtZGFzaGFycmF5PSI1LDUiLz4KPHRleHQgeD0iMzYwIiB5PSI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNjM2NmYxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5HbGFzczwvdGV4dD4KPHRleHQgeD0iMzYwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzYzNjZmMSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UFZCPC90ZXh0Pgo8dGV4dCB4PSIzNjAiIHk9IjIyMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNjM2NmYxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5HbGFzczwvdGV4dD4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0ibGFtaW5hdGVkTGF5ZXIxIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMTUiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjA4Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0ibGFtaW5hdGVkTGF5ZXIyIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMiIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImxhbWluYXRlZExheWVyMyIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjEiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjE1Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+',
    specifications: ['6.38mm thickness', 'PVB interlayer', 'Security glass', 'Sound dampening']
  },
  {
    id: '6',
    name: 'Tinted Glass',
    category: 'Decorative',
    description: 'Colored glass available in various tints for aesthetic appeal',
    basePrice: 20,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjhmOWZhIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjdGludGVkQmFzZSkiIHN0cm9rZT0iIzM3NDE1MSIgc3Ryb2tlLXdpZHRoPSIzIiByeD0iNiIvPgo8cmVjdCB4PSI2MCIgeT0iNjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSIxODAiIGZpbGw9InVybCgjYmx1ZVRpbnQpIiBvcGFjaXR5PSIwLjciLz4KPHJlY3QgeD0iMTYwIiB5PSI2MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjE4MCIgZmlsbD0idXJsKCNncmVlblRpbnQpIiBvcGFjaXR5PSIwLjciLz4KPHJlY3QgeD0iMjYwIiB5PSI2MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjE4MCIgZmlsbD0idXJsKCNicm9uemVUaW50KSIgb3BhY2l0eT0iMC43Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMyIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC40Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEyMCIgcj0iMyIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC40Ii8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE0MCIgcj0iMyIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC40Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMjcwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2MzY2ZjEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJsdWU8L3RleHQ+Cjx0ZXh0IHg9IjIwMCIgeT0iMjcwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiMxMGI5ODEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkdyZWVuPC90ZXh0Pgo8dGV4dCB4PSIzMDAiIHk9IjI3MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjZDk3NzA2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Ccm9uemU8L3RleHQ+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InRpbnRlZEJhc2UiIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4xIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4wNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImJsdWVUaW50IiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjODM4NmY3Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JlZW5UaW50IiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxMGI5ODEiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMzRkMzk5Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0iYnJvbnplVGludCIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZDk3NzA2Ii8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2Y1OWUwYiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==',
    specifications: ['5mm thickness', 'Color options', 'UV filtering', 'Fade resistant']
  }
];

interface ProductCatalogProps {
  onProductClick: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onProductClick }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts();
        setProducts(response.products || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products');
        // Fallback to static products if API fails
        setProducts([
          {
            id: '1',
            name: 'Mirror Glass',
            category: 'Mirrors',
            description: 'High-quality silvered mirror glass with crystal-clear reflection',
            basePrice: 15,
            image: 'https://images.pexels.com/photos/6186/light-man-person-red.jpg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            specifications: ['6mm thickness', 'Silvered backing', 'Polished edges', 'Moisture resistant']
          },
          {
            id: '2',
            name: 'Window Glass',
            category: 'Windows',
            description: 'Clear float glass perfect for windows and architectural applications',
            basePrice: 12,
            image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            specifications: ['4mm thickness', 'Float glass', 'UV protection', 'Thermal resistant']
          },
          {
            id: '3',
            name: 'Tempered Glass',
            category: 'Safety',
            description: 'Heat-treated safety glass with enhanced strength and durability',
            basePrice: 25,
            image: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
            specifications: ['8mm thickness', 'Safety certified', 'Heat resistant', 'Shatterproof']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Glass Products</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose from our premium selection of glass products and customize them to your exact requirements
        </p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">{error}. Showing cached products.</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </div>
  );
};