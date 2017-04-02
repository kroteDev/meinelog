module ApplicationHelper
	def title(page_title)
	  content_for :title, page_title.to_s
	end

	def og_url(url)
		content_for :og_url, 'http://www.meinelog.krotedev.com.br/'+url
	end

	def og_description(description)
	  content_for :og_description, description.to_s
	end
	
	def og_image(image)
	  content_for :og_image, 'http://www.meinelog.krotedev.com.br/assets/'+image
	end
end
