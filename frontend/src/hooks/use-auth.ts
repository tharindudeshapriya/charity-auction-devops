"use client"

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/auth-context';

export function useAuth() {
  return useAuthContext();
}