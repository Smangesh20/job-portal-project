import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { authMiddleware } from '@/middleware/auth';
import { ChatController } from '@/controllers/chatController';
import { validateRequest } from '@/middleware/validation';
import { z } from 'zod';

const router = Router();
const chatController = new ChatController();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Validation schemas
const createMessageSchema = z.object({
  content: z.string().min(1).max(1000),
  type: z.enum(['text', 'image', 'file']).default('text'),
  metadata: z.object({}).optional()
});

const getMessagesSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  before: z.string().datetime().optional()
});

/**
 * @route GET /api/chat/conversations
 * @desc Get user's conversations
 * @access Private
 */
router.get(
  '/conversations',
  asyncHandler(chatController.getConversations)
);

/**
 * @route GET /api/chat/conversations/:conversationId
 * @desc Get specific conversation
 * @access Private
 */
router.get(
  '/conversations/:conversationId',
  asyncHandler(chatController.getConversation)
);

/**
 * @route POST /api/chat/conversations
 * @desc Create new conversation
 * @access Private
 */
router.post(
  '/conversations',
  asyncHandler(chatController.createConversation)
);

/**
 * @route GET /api/chat/conversations/:conversationId/messages
 * @desc Get messages in conversation
 * @access Private
 */
router.get(
  '/conversations/:conversationId/messages',
  validateRequest(getMessagesSchema),
  asyncHandler(chatController.getMessages)
);

/**
 * @route POST /api/chat/conversations/:conversationId/messages
 * @desc Send message in conversation
 * @access Private
 */
router.post(
  '/conversations/:conversationId/messages',
  validateRequest(createMessageSchema),
  asyncHandler(chatController.sendMessage)
);

/**
 * @route PUT /api/chat/messages/:messageId
 * @desc Update message
 * @access Private
 */
router.put(
  '/messages/:messageId',
  validateRequest(createMessageSchema),
  asyncHandler(chatController.updateMessage)
);

/**
 * @route DELETE /api/chat/messages/:messageId
 * @desc Delete message
 * @access Private
 */
router.delete(
  '/messages/:messageId',
  asyncHandler(chatController.deleteMessage)
);

/**
 * @route POST /api/chat/conversations/:conversationId/read
 * @desc Mark conversation as read
 * @access Private
 */
router.post(
  '/conversations/:conversationId/read',
  asyncHandler(chatController.markAsRead)
);

export { router as chatRoutes };
