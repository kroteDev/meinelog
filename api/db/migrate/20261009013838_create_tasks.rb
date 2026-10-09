class CreateTasks < ActiveRecord::Migration[8.1]
  def change
    enable_extension "pgcrypto" unless extension_enabled?("pgcrypto")

    create_table :tasks, id: :uuid, default: "gen_random_uuid()" do |t|
      t.string :title, null: false
      t.text :description
      t.boolean :complete, default: false, null: false
      t.integer :priority, default: 0
      t.date :due_date
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
