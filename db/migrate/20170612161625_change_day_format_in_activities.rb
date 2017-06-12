class ChangeDayFormatInActivities < ActiveRecord::Migration
  def change
  	change_column :activities, :day, :date
  end
end
