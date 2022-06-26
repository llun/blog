---
title: Ruby and new Nodejs on AWS Lambda
lang: en
description: Ruby and newer Node.js on AWS Lambda experimentation
date: 2017-01-18
tags:
  - AWS Lambda
  - Ruby
  - Nodejs
---

It seems I started playing this quite late, Amazon released this service in late 2014 but didn’t have a chance to play with because most of the project I’m working with are in (web) frontend only and then last month, got a project that can start everything on api side with AWS Lambda with AWS API gateway.

## First try,

Q: can it use with Ruby.
A: Yes, however …

Current ReferralCandy stack are Ruby on Rails and most backend developer are Ruby developer, so if AWS Lambda can support ruby it would be nice, because everyone can start coding and move all project directly to AWS Lambda. However, Amazon doesn’t support Ruby yet, only node.js, java, pyton and C#, so I have to find another way.

There are few people tried running ruby on AWS Lambda already (Github project, [ruby-on-lambda](https://github.com/lorennorman/ruby-on-lambda) or [this post](http://www.adomokos.com/2016/06/using-ruby-in-aws-lambda.html)) basic concept is, using any native supported language and fork ruby process inside. Fork process is actually can be anything, so it’s not limited to ruby only but the hard problem is because ruby is not supported by default, so AWS image that’s going to run the process doesn’t have that ruby binary program too. To use ruby, it need binary and package that build for linux similar to image AWS use to run AWS Lambda and also all dependencies that requires native also need to build or use library that compatible to linux image that AWS Lambda is using (which is Amazon Linux AMI 2016.09.1 or similar)

So I tried that way, by create new EC2 instance with Amazon Linux AMI 2016.09.1 image and download source and compile with below command

```
./configure --prefix=/var/task/ruby --disable-install-doc
```

I disable doc to make package smaller, I won’t read document on AWS Lambda anyway and put it under `/var/task/ruby` because AWS Lambda function will run inside that path. Then, install library that required native binary e.g. mysql with gem
gem install mysql2 activerecord oj
This will create gem package in `/var/task/ruby` which will need later in AWS Lambda. Other required files are native library that those package will use, basically mysql, will need to copy from system lib directory (in this linux image, it’s in `/usr/lib64` or somewhere similar) and put it in `/var/task/lib` which `LD_LIBRARY_PATH` points to in AWS Lambda image and then package all this back to my AWS Lambda function. I use [apex](http://apex.run/) for managing AWS Lambda deployment, so file structure become something like below

```
root
|-functions
| |-awesome_ruby_task
| |-ruby // ruby binary directory is here
| |-lib // all native library are here
| |-index.js // entry point for lambda
| |-awesome.rb // awesome ruby task
|-project.json
```

and `index.js` is like below

```
var spawn = require('child_process').spawn
exports.handle = function (e, ctx, cb) {
var child = spawn('./ruby/bin/ruby', ['awesome.rb', JSON.stringify(e, null, 2), JSON.stringify(ctx, null, 2)])
var output = ''
var error = ''
child.stdout.on('data', function (data) { output += data })
child.stderr.on('data', function (data) { error += data })

child.on('close', function (code) {
if (code !== 0 || error) {
ctx.done(error)
}
ctx.done(null, JSON.parse(output))
})
}
```

with my `awesome.rb`

```
require 'json'
require 'yaml'
require 'active_record'

event = JSON.parse(ARGV[0])
db_config = YAML::load(File.open('database.yml'))
ActiveRecord::Base.establish_connection(db_config)

class Data < ActiveRecord::Base
end

data = Data(event['data_id'])

puts JSON.generate({
id: data.id
})
```

Everything works but the request time is slow, with maximum memory (1.5 GB in lambda advance settings) I can get at most 500ms for warm boot (and cold boot is a lot slower ~6s.) So this is no go for us.

## Second try

ok, ruby is no go (for now or at least required AWS native support or using transpiler like opal.rb which will revisit again later.) next, how’s about javascript.

Native javascript supported is also not that good for node.js, current `node.js` in AWS Lambda is still `Node 4.3`! that’s old. Current stable release is `6.9` and edge version is `7` already. The thing is, Javascript has something calls Babel which can convert any edge syntax to support syntax for old js engine. (`await/async` is a must for my team and I can understand how painful to switch to async style even `Promise` is making it nice already) Using babel slows down deploy time a bit but still acceptable.

Everything works fine, few weeks pass by after first AWS Lambda deployed and using in development stack, few issues raise in the cautions mode but will evaluate later when this small project go to production, here are list that will need to take care later

- Cold boot time is increasing when project size is get larger, this’s become problematic when adding more dependencies to the project.
- Parallel request cause multiple cold boot container and this cannot control. In AWS Lambda control panel, only memory that can adjust and increase memory make lambda start faster but it also increase the cost of lambda. So current tricky solution is using cron to ping the function in parallel (to the number that expecting that function will get call in parallel.) This issue, somehow don’t see people talk about it that much.
- Manually manage lambda functions is a pain, and this will getting more painful when having more lambda, so [apex](https://serverless.com/) or [serverless](https://serverless.com/) is a must.

This is the current state of my experiment for this one and a half month and end this post here. Hopefully I will revisit on the lambda again, after this stack go to production and have more fun with it.
