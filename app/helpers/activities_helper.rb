module ActivitiesHelper
	
	def find_priority(valor)
		valor = valor.to_i
		classe = ''
		if (valor == 1)
			classe = 'priority_very_low'
		end
		if (valor == 2)
			classe = 'priority_low'
		end
		if (valor == 3)
			classe = 'priority_medium'
		end
		if (valor == 4)
			classe = 'priority_high'
		end
		if (valor == 5)
			classe = 'priority_very_high'
		end
		return classe
	end
end
