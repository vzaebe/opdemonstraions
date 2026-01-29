const authService = require('./service')
const { created, success } = require('../../../utils/response')

/**
 * Auth Controller
 */
class AuthController {
  /**
   * POST /auth/register
   */
  async register(req, res, next) {
    try {
      const { email, password, name, phone } = req.body

      // Validation
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' })
      }

      const result = await authService.register({ email, password, name, phone })

      // Set cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      return created(res, result, 'User registered successfully')
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body

      // Validation
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
      }

      const result = await authService.login({ email, password })

      // Set cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      return success(res, result, 'Logged in successfully')
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /auth/guest
   */
  async createGuest(req, res, next) {
    try {
      const { email } = req.body

      const result = await authService.createGuest(email)

      // Set cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      return created(res, result, 'Guest session created')
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /auth/logout
   */
  async logout(req, res, next) {
    try {
      res.clearCookie('token')
      return success(res, null, 'Logged out successfully')
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /auth/me
   */
  async me(req, res, next) {
    try {
      const user = await authService.me(req.user.id)
      return success(res, user)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AuthController()
