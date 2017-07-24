class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
	has_many :clients, dependent: :destroy
	has_many :activities, dependent: :destroy
	has_many :comments, dependent: :destroy
	devise :timeoutable, :timeout_in => 15.days
	def self.from_omniauth(auth)
		result = User.where(email: auth.info.email)
		if !result
			where(email: auth.info.email, provider: auth.provider, uid: auth.uid).first_or_initialize.tap do |user|
				user.provider = auth.provider
				user.uid = auth.uid
				user.name = auth.info.name
				user.email = auth.info.email
				user.oauth_token = auth.credentials.token
				user.oauth_expires_at = Time.at(auth.credentials.expires_at) if auth.credentials.expires_at
				user.password = Devise.friendly_token[0,20]
				user.save!
			end
		else
			result.update(result, email: auth.info.email)
		end
	end
end
