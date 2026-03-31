export const mockBatchResponse = {
  batch_id: 'abc-123',
  queued: 3,
};

export const mockBatchStatusResponse = (batchId) => ({
  batch_id: batchId,
  files: [
    {
      title: 'File:Example1.jpg',
      status: 'success',
      target_url: 'https://hi.wikipedia.org/wiki/File:Example1.jpg',
      error: null,
      categories_localized: ['श्रेणी:उचित उपयोग'],
    },
    {
      title: 'File:Example2.png',
      status: 'processing',
      target_url: null,
      error: null,
      categories_localized: null,
    },
    {
      title: 'File:Example3.gif',
      status: 'queued',
      target_url: null,
      error: null,
      categories_localized: null,
    },
  ],
});

export const mockHistoryResponse = {
  records: [
    {
      id: 't-001',
      file_title: 'File:Example.jpg',
      source_wiki: 'en.wikipedia.org',
      target_wiki: 'hi.wikipedia.org',
      status: 'failed',
      error_message: 'API rate limit exceeded',
      created_at: '2024-06-15T10:30:00Z',
      celery_task_id: 'celery-xyz',
    },
    {
      id: 't-002',
      file_title: 'File:Nature.png',
      source_wiki: 'en.wikipedia.org',
      target_wiki: 'te.wikipedia.org',
      status: 'success',
      error_message: null,
      created_at: '2024-06-14T09:15:00Z',
      celery_task_id: 'celery-abc',
    },
  ],
  total: 42,
  page: 1,
  per_page: 25,
  stats: {
    total_transfers: 142,
    success_rate: 87.3,
    top_target_wiki: 'hi.wikipedia.org',
  },
};
