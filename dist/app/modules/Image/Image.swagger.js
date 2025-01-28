"use strict";
/**
 * @swagger
 * tags:
 *   name: Image
 *   description: API endpoints related to image
 */
// Upload images
/**
 * @swagger
 * /api/v1/image/upload-images:
 *   post:
 *     summary: Upload images
 *     description: You can upload multiple images at once
 *     tags: [Image]
 *     security:
 *       - AdminAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of images to upload
 *     responses:
 *       201:
 *         description: If the images are uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  success:
 *                    type: boolean
 *                    description: Indicates the success or failure of the operation
 *                  message:
 *                    type: string
 *                    description: A message indicating the result of the operation
 *                    example: Successfully uploaded the images
 *                  data:
 *                    type: object
 *                    description: A JSON object representing the uploaded information
 *                    properties:
 *                      uploaded_count:
 *                        type: number
 *                        description: The number of images successfully uploaded
 *                        example: 2
 *                      messages:
 *                        type: string
 *                        description: A message indicating the result of the operation
 *                        example: 2 image has been uploaded
 *       400:
 *         description: If you don't select any image
 *       401:
 *         description: If the user is not authenticated for the request. Only admin can add images
 */
// Get all images
/**
 * @swagger
 * /api/v1/image:
 *   get:
 *     summary: Retrieve all images
 *     description: Retrieves a list of all images
 *     tags: [Image]
 *     security:
 *       - AdminAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: The number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: The field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: asc | desc
 *           enum: [asc, desc]
 *         description: The order to sort by (asc or desc)
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: The search term for filtering
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: The image type for filtering
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *         description: From date to filter image
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *         description: To date to filter image
 *     responses:
 *       200:
 *         description: If retrieving all images is successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  success:
 *                    type: boolean
 *                    description: Indicates the success or failure of the operation
 *                  message:
 *                    type: string
 *                    description: A message indicating the result of the operation
 *                    example: Successfully retrieved the images
 *                  meta:
 *                    type: object
 *                    properties:
 *                      page:
 *                        type: number
 *                        description: The current page number
 *                        example: 1
 *                      limit:
 *                        type: number
 *                        description: The number of items per page
 *                        example: 10
 *                      total:
 *                        type: number
 *                        description: The total number of images
 *                        example: 14
 *                  data:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          description: The ID of the image
 *                          example: 656c6ccf-199c-454c-937b-f41c148f673b
 *                        user_id:
 *                          type: string
 *                          description: The ID of the uploader
 *                          example: 656c6ccf-199c-454c-937b-f41c148f673b
 *                        name:
 *                          type: string
 *                          description: The name of the image
 *                          example: image1
 *                        alt_text:
 *                          type: string
 *                          description: The name of the image
 *                          example: image1
 *                        type:
 *                          type: string
 *                          description: The name of the image
 *                          example: image/jpeg
 *                        size:
 *                          type: number
 *                          description: Size of the image in byte
 *                          example: 59676
 *                        width:
 *                          type: number
 *                          description: The width of the image in pixels
 *                          example: 1200
 *                        height:
 *                          type: number
 *                          description: The height of the image in pixels
 *                          example: 800
 *                        path:
 *                          type: string
 *                          format: uri
 *                          description: The path of the image
 *                          example: https://example.com/nue4ryu9jt4vcmq4g976.jpg
 *                        bucket_id:
 *                          type: string
 *                          description: The cloud ID of the image
 *                          example: ce072252-3b95-4579-8566-d72e8316cc58
 *                        created_at:
 *                          type: string
 *                          format: date-time
 *                          description: The uploaded date of the image
 *                          example: 2023-01-01T00:00:00.000Z
 *                        updated_at:
 *                          type: string
 *                          format: date-time
 *                          description: The last updated date of the image
 *                          example: 2023-01-01T00:00:00.000Z
 *                        user:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                              description: The ID of the uploader
 *                              example: 656c6ccf-199c-454c-937b-f41c148f673b
 *                            name:
 *                              type: string
 *                              description: The name of the uploader
 *                              example: John Doe
 *       401:
 *         description: If the user is not authenticated for the request. Only admin get all images
 */
// Get a single image
/**
 * @swagger
 * /api/v1/image/{id}:
 *   get:
 *     summary: Retrieve a single image by ID
 *     description: Retrieve a single image by ID
 *     tags: [Image]
 *     security:
 *       - AdminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the image to retrieve
 *     responses:
 *       200:
 *         description: If retrieving a single image is successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  success:
 *                    type: boolean
 *                    description: Indicates the success or failure of the operation
 *                  message:
 *                    type: string
 *                    description: A message indicating the result of the operation
 *                    example: Successfully retrieved the image
 *                  data:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          description: The ID of the image
 *                          example: 656c6ccf-199c-454c-937b-f41c148f673b
 *                        user_id:
 *                          type: string
 *                          description: The ID of the uploader
 *                          example: 656c6ccf-199c-454c-937b-f41c148f673b
 *                        name:
 *                          type: string
 *                          description: The name of the image
 *                          example: image1
 *                        alt_text:
 *                          type: string
 *                          description: The name of the image
 *                          example: image1
 *                        type:
 *                          type: string
 *                          description: The name of the image
 *                          example: image/jpeg
 *                        size:
 *                          type: number
 *                          description: Size of the image in byte
 *                          example: 59676
 *                        width:
 *                          type: number
 *                          description: The width of the image in pixels
 *                          example: 1200
 *                        height:
 *                          type: number
 *                          description: The height of the image in pixels
 *                          example: 800
 *                        path:
 *                          type: string
 *                          format: uri
 *                          description: The path of the image
 *                          example: https://example.com/nue4ryu9jt4vcmq4g976.jpg
 *                        bucket_id:
 *                          type: string
 *                          description: The cloud ID of the image
 *                          example: ce072252-3b95-4579-8566-d72e8316cc58
 *                        created_at:
 *                          type: string
 *                          format: date-time
 *                          description: The uploaded date of the image
 *                          example: 2023-01-01T00:00:00.000Z
 *                        updated_at:
 *                          type: string
 *                          format: date-time
 *                          description: The last updated date of the image
 *                          example: 2023-01-01T00:00:00.000Z
 *                        user:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                              description: The ID of the uploader
 *                              example: 656c6ccf-199c-454c-937b-f41c148f673b
 *                            name:
 *                              type: string
 *                              description: The name of the uploader
 *                              example: John Doe
 *       401:
 *         description: If the user is not authenticated for the request. Only admin get an image details
 *       404:
 *         description: If the image is not found
 */
// Update a single image
/**
 * @swagger
 * /api/v1/image/update/{id}:
 *   patch:
 *     summary: Update an uploaded image name by ID
 *     description: Update an uploaded image name by ID
 *     tags: [Image]
 *     security:
 *       - AdminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the image to update
 *     requestBody:
 *       description: You can update the name of the image
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the image
 *                 example: image1
 *               alt_text:
 *                 type: string
 *                 description: Alter text of the image
 *                 example: image1
 *     responses:
 *       200:
 *         description: If the image is updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  success:
 *                    type: boolean
 *                    description: Indicates the success or failure of the operation
 *                  message:
 *                    type: string
 *                    description: A message indicating the result of the operation
 *                    example: Successfully updated the image name
 *                  data:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          description: The ID of the image
 *                          example: 656c6ccf-199c-454c-937b-f41c148f673b
 *                        user_id:
 *                          type: string
 *                          description: The ID of the uploader
 *                          example: 656c6ccf-199c-454c-937b-f41c148f673b
 *                        name:
 *                          type: string
 *                          description: The name of the image
 *                          example: image1
 *                        alt_text:
 *                          type: string
 *                          description: The name of the image
 *                          example: image1
 *                        type:
 *                          type: string
 *                          description: The name of the image
 *                          example: image/jpeg
 *                        size:
 *                          type: number
 *                          description: Size of the image in byte
 *                          example: 59676
 *                        width:
 *                          type: number
 *                          description: The width of the image in pixels
 *                          example: 1200
 *                        height:
 *                          type: number
 *                          description: The height of the image in pixels
 *                          example: 800
 *                        path:
 *                          type: string
 *                          format: uri
 *                          description: The path of the image
 *                          example: https://example.com/nue4ryu9jt4vcmq4g976.jpg
 *                        bucket_id:
 *                          type: string
 *                          description: The cloud ID of the image
 *                          example: ce072252-3b95-4579-8566-d72e8316cc58
 *                        created_at:
 *                          type: string
 *                          format: date-time
 *                          description: The uploaded date of the image
 *                          example: 2023-01-01T00:00:00.000Z
 *                        updated_at:
 *                          type: string
 *                          format: date-time
 *                          description: The last updated date of the image
 *                          example: 2023-01-01T00:00:00.000Z
 *                        user:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                              description: The ID of the uploader
 *                              example: 656c6ccf-199c-454c-937b-f41c148f673b
 *                            name:
 *                              type: string
 *                              description: The name of the uploader
 *                              example: John Doe
 *       401:
 *         description: If the user is not authenticated for the request. Only admin can update an image name
 *       404:
 *         description: If the image is not found
 */
// Delete multiple images
/**
 * @swagger
 * /api/v1/image/delete-images:
 *   delete:
 *     summary: Delete multiple images by cloud id's
 *     description: Delete multiple images by cloud id's
 *     tags: [Image]
 *     security:
 *       - AdminAuth: []
 *     requestBody:
 *       description: You can delete multiple images by cloud id's
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               images_path:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: ztwio3iampjnq9g183xp
 *                 description: The cloud id's of the images to delete
 *     responses:
 *       200:
 *         description: If the images are deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  success:
 *                    type: boolean
 *                    description: Indicates the success or failure of the operation
 *                  message:
 *                    type: string
 *                    description: A message indicating the result of the operation
 *                    example: Successfully deleted the images
 *                  data:
 *                      type: object
 *                      properties:
 *                        deleted_count:
 *                          type: number
 *                          description: The number of images deleted
 *                          example: 2
 *                        message:
 *                          type: string
 *                          description: 1 image has been deleted
 *       400:
 *         description: If any valid id is not provided
 *       401:
 *         description: If the user is not authenticated for the request. Only admin can delete images
 *       500:
 *         description: If there is an error deleting the images
 */
