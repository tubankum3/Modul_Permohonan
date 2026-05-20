import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdvokasiStore } from '../../useAdvokasiStore';
import { Permohonan, PendampinganRecord, PerkaraRecord } from '../../types';

// Simulate a network delay (e.g. 300ms) for asynchrony
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const usePermohonanListQuery = () => {
  return useQuery({
    queryKey: ['permohonanList'],
    queryFn: async () => {
      await delay(200);
      return useAdvokasiStore.getState().permohonanList;
    },
  });
};

export const usePendampinganRecordsQuery = () => {
  return useQuery({
    queryKey: ['pendampinganRecords'],
    queryFn: async () => {
      await delay(200);
      return useAdvokasiStore.getState().pendampinganRecords;
    },
  });
};

export const usePerkaraRecordsQuery = () => {
  return useQuery({
    queryKey: ['perkaraRecords'],
    queryFn: async () => {
      await delay(200);
      return useAdvokasiStore.getState().perkaraRecords;
    },
  });
};

export const usePutusanRecordsQuery = () => {
  return useQuery({
    queryKey: ['putusanRecords'],
    queryFn: async () => {
      await delay(200);
      return useAdvokasiStore.getState().putusanRecords;
    },
  });
};

export const useSaveDraftMutation = () => {
  const queryClient = useQueryClient();
  const store = useAdvokasiStore();
  
  return useMutation({
    mutationFn: async (draft: Omit<Permohonan, 'id' | 'status' | 'tanggal' | 'unit' | 'history' | 'pemohon'>) => {
      await delay(200);
      store.handleSaveDraft(draft);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permohonanList'] });
    },
  });
};

export const useUpdateDraftMutation = () => {
  const queryClient = useQueryClient();
  const store = useAdvokasiStore();

  return useMutation({
    mutationFn: async (updatedDraft: Permohonan) => {
      await delay(200);
      store.handleUpdateDraft(updatedDraft);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permohonanList'] });
    },
  });
};

export const useDeletePermohonanMutation = () => {
  const queryClient = useQueryClient();
  const store = useAdvokasiStore();

  return useMutation({
    mutationFn: async (id: string) => {
      await delay(200);
      store.handleDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permohonanList'] });
    },
  });
};

export const useSendPermohonanMutation = () => {
  const queryClient = useQueryClient();
  const store = useAdvokasiStore();

  return useMutation({
    mutationFn: async (id: string) => {
      await delay(200);
      store.handleSend(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permohonanList'] });
    },
  });
};

export const useSavePerkaraMutation = () => {
  const queryClient = useQueryClient();
  const store = useAdvokasiStore();

  return useMutation({
    mutationFn: async (record: PerkaraRecord) => {
      await delay(200);
      store.handleSavePerkara(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perkaraRecords'] });
      queryClient.invalidateQueries({ queryKey: ['permohonanList'] });
    },
  });
};

export const useSavePendampinganMutation = () => {
  const queryClient = useQueryClient();
  const store = useAdvokasiStore();

  return useMutation({
    mutationFn: async (record: PendampinganRecord) => {
      await delay(200);
      store.handleSavePendampingan(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendampinganRecords'] });
      queryClient.invalidateQueries({ queryKey: ['permohonanList'] });
    },
  });
};
