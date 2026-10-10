class CreateComments < ActiveRecord::Migration[8.1]
  def change
    enable_extension "pgcrypto" unless extension_enabled?("pgcrypto")

    create_table :comments, id: :uuid, default: "gen_random_uuid()" do |t|
      t.text :description, null: false
      t.references :user, null: false, foreign_key: true
      t.references :commentable, polymorphic: true, type: :uuid, null: false

      t.timestamps
    end
  end
end
