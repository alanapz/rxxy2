# rxxy2

Website: http://alanpinder.com/rxxy2/

Demo: http://alanpinder.com/rxxy2-demo/

Gitlab: https://github.com/alanapz/rxxy2

Docker: https://hub.docker.com/repository/docker/alanmpinder/rxxy2

### about

Rxxy2 is a simple RXJS sandbox tool, designed to help beginners visualise and write RXJS pipelines.

- Rxxy2 uses Javascript proxying to instrument all RXJS operators and functions
- Rxxy2 parses the pipeline and displays it in an easy-to-visualise graphical form
- Rxxy2 supports 'single-stepping' through pipelines - examining the progress of a single value
- Rxxy2 natively supports "inner observables" (eg: with mergeMap / concatMap)
- Rxxy2 allows pipeline pauses and flow control

The idea is to integrate annotated example pipelines, to help beginners understand the subtleties of RxJS.
Example pipelines are:

- Introduction to pipelines
- The life-cycle of a pipeline
- Pipeline error handling
- Basic operators
- Introduction to subjects
- ReplaySubject, AsyncSubject and BehaviourSubject
- Introduction to inner observables
- Difference between concatMap / mergeMap
- Best practices