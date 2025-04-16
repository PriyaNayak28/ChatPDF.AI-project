import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import User from '../models/User'
import dotenv from 'dotenv'

dotenv.config()

interface GitHubProfile {
  id: string
  displayName: string
  username: string
  emails?: { value: string }[]
}

interface GitHubStrategyOptions {
  clientID: string
  clientSecret: string
  callbackURL: string
}

interface GitHubVerifyCallback {
  (
    accessToken: string,
    refreshToken: string,
    profile: GitHubProfile,
    done: (error: Error | null, user: any | null) => void
  ): Promise<void>
}

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK!,
    } as GitHubStrategyOptions,
    (async (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: (error: Error | null, user: any | null) => void
    ) => {
      try {
        let user = await User.findOne({ where: { githubId: profile.id } })
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            name: profile.displayName || profile.username,
            email:
              profile.emails?.[0]?.value ||
              `no-email-${profile.id}@example.com`,
          })
        }
        done(null, user)
      } catch (error) {
        done(error as Error, null)
      }
    }) as GitHubVerifyCallback
  )
)

passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id: number, done) => {
  const user = await User.findByPk(id)
  done(null, user)
})
