class CreateActivities < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.string :title
      t.text :description
      t.datetime :day
      t.time :duration
      t.string :priority
      t.references :client, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
