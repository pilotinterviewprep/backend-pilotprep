/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API endpoints related to authentication
 */

// Send OTP to register an user
/**
 * @swagger
 * /api/v1/auth/send-otp:
 *   post:
 *     summary: Send OTP to register an user
 *     description: Sends OTP to register an user.
 *     tags: [Auth]
 *     requestBody:
 *       description: Name and contact number is required. Email is optional.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - contact_number
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 nullable: true
 *                 description: The email of the user
 *                 example: user@example.com
 *               contact_number:
 *                 type: string
 *                 description: The contact number of the user
 *                 example: '01511111111'
 *     responses:
 *       201:
 *         description: OTP sent successfully
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
 *                    example: OTP sent successfully
 *                  data:
 *                    type: object
 *                    description: A JSON object representing the OTP sent details.
 *                    properties:
 *                      contact_number:
 *                        type: string
 *                        description: The contact number of the user
 *                        example: '01511111111'
 *                      expires_at:
 *                        type: string
 *                        description: The expiration time of the OTP
 *                        example: "1731484307833"
 *       400:
 *         description: If the request is invalid or missing required fields
 *       409:
 *         description: If an user exists with the same contact number
 */

// Register an user
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register an user
 *     description: Registers an user with OTP.
 *     tags: [Auth]
 *     requestBody:
 *       description: OTP and password must be required
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *               - password
 *             properties:
 *               otp:
 *                 type: number
 *                 description: The OTP sent to the user
 *                 example: 123456
 *               password:
 *                 type: string
 *                 description: The new password of the user
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                    example: User registration is successful
 *                  data:
 *                    type: object
 *                    description: A JSON object representing the new user.
 *                    properties:
 *                      id:
 *                        type: string
 *                        description: The unique ID of the user
 *                        example: 1656c6ccf-199c-454c-937b-f41c148f673b
 *                      name:
 *                        type: string
 *                        description: The name of the user
 *                        example: John Doe
 *                      email:
 *                        type: string
 *                        format: email
 *                        nullable: true
 *                        description: The email of the user
 *                        example: user@example.com
 *                      contact_number:
 *                        type: string
 *                        description: The contact number of the user
 *                        example: '01511111111'
 *                      role:
 *                        type: string
 *                        description: The role of the user
 *                        example: USER
 *                      status:
 *                        type: string
 *                        description: The status of the user
 *                        example: ACTIVE
 *                      profile_pic:
 *                        type: string
 *                        format: uri
 *                        nullable: true
 *                        description: The profile picture of the user
 *                        example: null
 *                      created_at:
 *                        type: string
 *                        format: date-time
 *                        description: The date and time when the user was created
 *                        example: "2023-08-12T12:00:00.000Z"
 *                      updated_at:
 *                        type: string
 *                        format: date-time
 *                        description: The date and time when the user was last updated
 *                        example: "2023-08-12T12:00:00.000Z"
 *       400:
 *         description: If the request is invalid or missing required fields
 *       403:
 *         description: If the OTP has expired
 *       409:
 *         description: If an user exists with the same contact number
 */

// Login an user
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login an user
 *     description: Logs in an user with email/contact number and password.
 *     tags: [Auth]
 *     requestBody:
 *       description: Email/Contact number and password must be required
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email_or_contact_number
 *               - password
 *             properties:
 *               email_or_contact_number:
 *                 type: string
 *                 description: The email or contact number of the user
 *                 example: user@example.com | 01511111111
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
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
 *                    example: User logged in successfully
 *                  data:
 *                    type: object
 *                    description: A JSON object representing the logged-in user.
 *                    properties:
 *                      id:
 *                        type: string
 *                        description: The unique ID of the user
 *                        example: 1656c6ccf-199c-454c-937b-f41c148f673b
 *                      name:
 *                        type: string
 *                        description: The name of the user
 *                        example: John Doe
 *                      email:
 *                        type: string
 *                        format: email
 *                        nullable: true
 *                        description: The email of the user
 *                        example: user@example.com
 *                      contact_number:
 *                        type: string
 *                        description: The contact number of the user
 *                        example: '01511111111'
 *                      role:
 *                        type: string
 *                        description: The role of the user
 *                        example: USER
 *                      profile_pic:
 *                        type: string
 *                        format: uri
 *                        nullable: true
 *                        description: The profile picture of the user
 *                        example: https://example.com/profile.jpg | null
 *                      access_token:
 *                        type: string
 *                        description: The access token used for authentication
 *                        example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIzMzUxMzBkLWViMzctNDViZi1iNTIyLTg5YzUyZmZlMjUyMyIsImNvbnRhY3RfbnVtYm.vFlqGmeUJHS5hjAKqf88EhGcDE8hWktj5MbpLe6axnE
 *       400:
 *         description: If the request is invalid or missing required fields
 *       403:
 *         description: If the email/contact number or password is incorrect
 *       404:
 *         description: If the user is not exists
 */

// Reset Password
/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset Password
 *     description: Reset password of an user by the old password.
 *     tags: [Auth]
 *     security:
 *       - UserAuth: []
 *     requestBody:
 *       description: Old and new password must be required to reset password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - old_password
 *               - new_password
 *             properties:
 *               old_password:
 *                 type: string
 *                 description: The old password of the user
 *                 example: password123
 *               new_password:
 *                 type: string
 *                 description: The password of the user
 *                 example: password123
 *     responses:
 *       200:
 *         description: Password reset successfully
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
 *                    example: Password reset is successful
 *                  data:
 *                    type: object
 *                    description: A JSON object representing the user.
 *                    properties:
 *                      id:
 *                        type: string
 *                        description: The unique ID of the user
 *                        example: 1656c6ccf-199c-454c-937b-f41c148f673b
 *                      name:
 *                        type: string
 *                        description: The name of the user
 *                        example: John Doe
 *                      email:
 *                        type: string
 *                        format: email
 *                        nullable: true
 *                        description: The email of the user
 *                        example: user@example.com
 *                      contact_number:
 *                        type: string
 *                        description: The contact number of the user
 *                        example: '01511111111'
 *                      role:
 *                        type: string
 *                        description: The role of the user
 *                        example: USER
 *                      profile_pic:
 *                        type: string
 *                        format: uri
 *                        nullable: true
 *                        description: The profile picture of the user
 *                        example: https://example.com/profile.jpg | null
 *                      access_token:
 *                        type: string
 *                        description: The access token used for authentication
 *                        example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIzMzUxMzBkLWViMzctNDViZi1iNTIyLTg5YzUyZmZlMjUyMyIsImNvbnRhY3RfbnVtYm.vFlqGmeUJHS5hjAKqf88EhGcDE8hWktj5MbpLe6axnE
 *
 *       400:
 *         description: If the request is invalid or missing required fields
 *       401:
 *         description: If the user is not authenticated
 */

// Forgot Password
/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     description: Forgot password of an user by the email or contact number.
 *     tags: [Auth]
 *     requestBody:
 *       description: Email or contact number must be required
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email_or_contact_number
 *             properties:
 *               email_or_contact_number:
 *                 type: string
 *                 description: The email or contact number of the user
 *                 example: user@example.com | 01511111111
 *     responses:
 *       200:
 *         description: New password sent to user email and contact number
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
 *                    example: New password sent to your email and contact number
 *                  data:
 *                    type: string
 *                    description: No data is returned in the response
 *                    example: null
 *       400:
 *         description: If the request is invalid or missing required fields
 *       404:
 *         description: If the user is not exists
 */
