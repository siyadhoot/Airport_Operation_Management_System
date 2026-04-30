// src/lib/useFlightSocket.ts
// ============================================================
//  WebSocket (STOMP over SockJS) hook for live flight updates
// ============================================================
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useFlightStore } from '@/store';
import { WsFlightUpdate } from '@/types';
import toast from 'react-hot-toast';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/api/ws';

export function useFlightSocket() {
  const clientRef = useRef<Client | null>(null);
  const applyLiveUpdate = useFlightStore((s) => s.applyLiveUpdate);
  const connected = useRef(false);

  const connect = useCallback(() => {
    if (connected.current) return;

    const client = new Client({
      // SockJS factory for browser compatibility
      webSocketFactory: () => new SockJS(WS_URL) as WebSocket,
      reconnectDelay: 5000,
      onConnect: () => {
        connected.current = true;
        console.log('[WS] Connected to flight status feed');

        // Subscribe to the live flight-status topic
        client.subscribe('/topic/flight-status', (message) => {
          try {
            const update: WsFlightUpdate = JSON.parse(message.body);
            applyLiveUpdate(update);

            // Toast notification for status changes
            if (update.type === 'FLIGHT_UPDATE' && update.flight) {
              const { flightNumber, status } = update.flight;
              if (status === 'DELAYED') {
                toast.error(`✈ ${flightNumber} is now DELAYED`);
              } else if (status === 'EMERGENCY') {
                toast.error(`🚨 EMERGENCY: ${flightNumber}`, { duration: 6000 });
              } else if (status === 'DEPARTED') {
                toast.success(`✈ ${flightNumber} has DEPARTED`);
              }
            }
          } catch (err) {
            console.error('[WS] Failed to parse message:', err);
          }
        });

        // Send a ping to confirm connection
        client.publish({
          destination: '/app/flight-ping',
          body: JSON.stringify({ msg: 'hello' }),
        });
      },
      onDisconnect: () => {
        connected.current = false;
        console.log('[WS] Disconnected');
      },
      onStompError: (frame) => {
        console.error('[WS] STOMP error:', frame.headers['message']);
      },
    });

    client.activate();
    clientRef.current = client;
  }, [applyLiveUpdate]);

  const disconnect = useCallback(() => {
    clientRef.current?.deactivate();
    connected.current = false;
  }, []);

  useEffect(() => {
    connect();
    return () => { disconnect(); };
  }, [connect, disconnect]);

  return { connected: connected.current };
}
