# encoding: utf-8

desc 'Check links for live site'
task :test do
  begin
    require 'anemone'

    root = 'http://brbsix.github.io/'
    failed = false
    puts 'Checking links with anemone ...'

    # https://github.com/endymion/link-checker
    # check-links --no-warnings http://brbsix.github.io

    Anemone.crawl(root, :discard_page_bodies => true) do |anemone|
        anemone.after_crawl do |pagestore|
            broken_links = Hash.new { |h, k| h[k] = [] }
            pagestore.each_value do |page|
                if page.code != 200 && page.code != 301
                    referrers = pagestore.pages_linking_to(page.url)
                    referrers.each do |referrer|
                        broken_links[referrer] << page
                    end
                end
            end
            if not broken_links.empty?
                failed = true
                puts "\nLinks with issues: "
                broken_links.each do |referrer, pages|
                    puts "#{referrer.url} contains the following broken links:"
                    pages.each do |page|
                        puts "  HTTP #{page.code} #{page.url}"
                    end
                end
                puts "\nHas issues!"
            else
                puts "\nNo issues!"
            end
        end
    end
    puts "\n... done!"

    if failed
        abort
    end

  rescue LoadError
    abort 'Install anemone gem: gem install anemone'
  end
end
