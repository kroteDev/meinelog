class Client < ActiveRecord::Base
	belongs_to :user
	has_attached_file :logo, styles: { medium: "500x500>", thumb: "100x100>" }, default_url: "/system/default_images/clients/logos/:style/missing.png"
	validates_attachment_content_type :logo, content_type: /\Aimage\/.*\z/
	validates_presence_of :nome
end