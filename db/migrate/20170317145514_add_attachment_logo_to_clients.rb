class AddAttachmentLogoToClients < ActiveRecord::Migration
  def self.up
    change_table :clients do |t|
      t.attachment :logo
    end
  end

  def self.down
    remove_attachment :clients, :logo
  end
end
