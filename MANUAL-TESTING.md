# Manual API Testing Guide

## Prerequisites

1. **Start the server:**
   ```bash
   npm run start:dev
   ```

2. **In another terminal, run the comprehensive test:**
   ```bash
   npm run test:api
   ```

## Manual Testing Checklist

### ✅ 1. GET /categories
- **Expected**: 3-5 seeded categories
- **Check**: Categories are sorted by name
- **Response format**: `{ id, name }`

### ✅ 2. POST /todos (5 tasks)
- **Create 5 tasks in the same category**
- **Expected**: All 5 tasks created successfully
- **Check**: Each task has correct category info

### ✅ 3. POST /todos (6th task - should fail)
- **Try to create 6th task in same category**
- **Expected**: 400 Bad Request
- **Error message**: "Category '<name>' already has 5 tasks."

### ✅ 4. GET /todos?category=<id>
- **Filter by specific category ID**
- **Expected**: Only tasks from that category
- **Check**: Correct category filtering

### ✅ 5. PATCH /todos/:id
- **Update task completion status**
- **Body**: `{ "completed": true }`
- **Expected**: Task status updated
- **Check**: Status change reflected in database

### ✅ 6. DELETE /todos/:id
- **Delete a task**
- **Expected**: 204 No Content
- **Check**: Task no longer exists (404 on GET)

### ✅ 7. GET /todos
- **Get all tasks**
- **Expected**: Correct number of tasks
- **Check**: All tasks have category info

## Test Scenarios

### Scenario 1: Business Rule Testing
1. Create 5 tasks in category A ✅
2. Try to create 6th task in category A ❌ (400 error)
3. Create 5 tasks in category B ✅
4. Delete 1 task from category A ✅
5. Create 1 task in category A ✅ (now has 5 again)
6. Try to create 6th task in category A ❌ (400 error)

### Scenario 2: Category Filtering
1. GET /todos?category=All → All tasks
2. GET /todos?category=<category-id> → Filtered tasks
3. GET /todos → All tasks (same as All)

### Scenario 3: CRUD Operations
1. POST /todos → Create task
2. GET /todos/:id → Read task
3. PATCH /todos/:id → Update status
4. DELETE /todos/:id → Delete task

## Expected Results

- ✅ All endpoints return correct status codes
- ✅ Validation works for all DTOs
- ✅ Business rules are enforced
- ✅ Error messages are clear and helpful
- ✅ Response formats match contracts
- ✅ Database operations are consistent

## Troubleshooting

### Server not running
```bash
npm run start:dev
```

### Database not seeded
```bash
npm run prisma:seed
```

### Database connection issues
```bash
npm run test:db
```

### Validation issues
```bash
npm run test:validation
```

## Success Criteria

When all tests pass:
- ✅ API is stable and ready for frontend
- ✅ All business rules are enforced
- ✅ Error handling is working correctly
- ✅ Data consistency is maintained
- ✅ Performance is acceptable

**Ready to proceed to frontend development! 🚀**
