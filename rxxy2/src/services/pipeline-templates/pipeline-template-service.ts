import { Injectable } from '@angular/core';
import { assert } from "src/app/utils";
import { PipelineTemplate } from "src/models/pipeline-template";

@Injectable({
  providedIn: 'root'
})
export class PipelineTemplateService {

  private readonly templates: PipelineTemplate[] = [];

  constructor() {
    this.initialiseTemplates();
  }

  getTemplates(): PipelineTemplate[] {
    return this.templates;
  }

  generateSource(source: string, template?: PipelineTemplate): string {
    assert(source, 'source');
    if (!template) {
      return source;
    }
    let buff = '';
    buff += `${this.basicSampleHttpService()}\r\n\r\n`;
    buff += `${source}\r\n\r\n`;
    if (template.metadata) {
      Object.getOwnPropertyNames(template.metadata).forEach(key => {
        buff += `if ((typeof ${key}) === 'object') { _metadata(${key}, ${JSON.stringify(template.metadata[key])}); }\r\n\r\n`;
      });
    }
    console.log(buff);
    return buff;
  }

  private initialiseTemplates(): void {
    /*
        this.addTemplate({
          slug: 'basic_pipeline',
          name: 'Pipeline de base',
          difficulty: 1,
          source: `
    // Imaginons httpService.getCurrentUser() simule une requête HTTP

    this.httpService.getCurrentUser()
        // pipe() est utilisé pour appliquer des opérateurs à notre observable
        .pipe(
            // Recup juste le nom d'utilisateur
            map(user => user.username),
            // Transformer en majuscule
            map(username => username.toUpperCase())
        // On appel subscribe() pour attacher un 'Observer' à notre pipeline
        // Tant qu'il n'y a pas de subscribe(), le pipeline ne fait rien (pas d'appel HTTP)
        ).subscribe(username => {
            // Affiche la valeur renvoyée
            alert('Hello: ' + username);
    });



    // RXXY internal plumbing - do not modify after this line

    rxxy.configure([{
        sourceText: 'this.httpService.getCurrentUser(): Observable<{username: string, email: string}>;',
        sourceComment: 'Cet objet simule la réponse d\\'une requête HTTP.',
        operators: [{
          comment: 'map(), comme en JS, transforme une valeur à un autre.<br />Ici on transform la valeur entrante (l\\'objet {username: string, email: string}) à juste son username',
          showHelpUrl: true
        },{
          comment: 'On pourrait enchainer plusiers opérateurs dans une seule pipeline - ici, on reapplique map() une deuxième fois pour transformer le nom en majuscule'
        }]
    }]);

    `});

        this.addTemplate({
          slug: 'error_handling',
          name: 'Pipeline de base',
          difficulty: 2,
          setup: [this.basicSampleHttpService()],
          template: `
    // Imaginons httpService.getCurrentUser() simule une requête HTTP

    this.httpService.getCurrentUser()
        // pipe() est utilisé pour appliquer des opérateurs à notre observable
        .pipe(
            // Recup juste le nom d'utilisateur
            map(user => user.username),
            // Transformer en majuscule
            map(username => username.toUpperCase())
        // On appel subscribe() pour attacher un 'Observer' à notre pipeline
        // Tant qu'il n'y a pas de subscribe(), le pipeline ne fait rien (pas d'appel HTTP)
        ).subscribe(username => {
            // Affiche la valeur renvoyée
            alert('Hello: ' + username);
    });



    // RXXY internal plumbing - do not modify after this line

    rxxy.configure([{
        sourceText: 'this.httpService.getCurrentUser(): Observable<{username: string, email: string}>;',
        sourceComment: 'Cet objet simule la réponse d\\'une requête HTTP.',
        operators: [{
          comment: 'map(), comme en JS, transforme une valeur à un autre.<br />Ici on transform la valeur entrante (l\\'objet {username: string, email: string}) à juste son username',
          showHelpUrl: true
        },{
          comment: 'On pourrait enchainer plusiers opérateurs dans une seule pipeline - ici, on reapplique map() une deuxième fois pour transformer le nom en majuscule'
        }]
    }]);

    `});

    */
    this.addTemplate({
      slug: 'concatmap_versus_mergemap',
      name: 'Les différences entre concatMap() et mergeMap()',
      description: 'Deux exemples qui essayent de montrer les différences entre les concatMap et mergeMap opérateurs',
      difficulty: 4,
      metadata: {
        concatMapExemple: {
          title: 'concatMap',
          desc: 'Ici on a un observable qui, pour chaque valeur, utilise concatMap pour lancer une 2ieme pipeline (\'inner observable\') - dans cette exemple, pour récupérér les détails du nom de l\'utilisateur passé comme valeur.<br /><br />' +
            'concatMap "serialize" les inner observables - c\'ést-a-dire, il attend que l\'inner observable précédent se termine avant de lancer le prochain.<br /><br />' +
            '<b>Ca veut dire qu\'on n\'aura que un inner observable (requête HTTP) actif à la fois.</b><br /><br/>' +
            '<ul>' +
            ' <li>On lance un inner observable <tt>this.httpService.getDetailsForUser</tt> ensuite <tt>_pause()</tt> pour le premièr utilisateur (\'pierre\')</li>' +
            ' <li>On appel <tt>this.httpService.getDetailsForUser</tt> pour le premièr utilisateur (\'pierre\')</li>' +
            ' <li>Pour plus facilement vous montrer</li>' +
            ' <li>On attend jusqu\'a l\'inner observable <tt>this.httpService.getDetailsForUser</tt> pour le premièr utilisateur (\'pierre\')</li>' +
            '</ul>',
          operators: [{
            desc: 'Cette fonction est appelée pour chaque valeur.<br /><br />Si l\'index est 1 (du coup on est en train de traiter la 2ieme valeur dans la liste) on balance un erreur; sinon on renvoie la valeur telle qu\'elle est.'
          }],
          observer: {
            desc2: 'Les résultats seront dans exactement le même ordre que nos valuers entrantes - on aura <tt>pierre</tt> ensuite <tt>paul</tt> ensuite <tt>jack</tt> toujours dans cet ordre.<br/><br/>' +
              '<ul>' +
              '<li>Utilise concatMap alors quand l\'ordre des résultats est important</li>' +
              '<li>Priviléger concatMap plutôt que mergeMap si vous faites des actions lourd (appel HTTP par exemple) et vous risquez d\'avoir beaucoup des valuers - on ne veut pas lancer 20 requêtes HTTP au même instant</li>' +
              '</ul>'
          }
        },
        mergeMapExemple: {
          title: 'mergeMap',
          desc: '',
          operators: [{
            desc: ''
          }],
          observer: {
            desc2: 'Les résultats seront remontés dans l\'ordre que vous avez clicue sur le botuon<br/><br/>' +
              '<ul>' +
              '<li>Utilise mergeMapMap quand l\'ordre des résultats n\'est pas important</li>' +
              '<li>Priviléger concatMap plutôt que mergeMap si vous faites des actions lourd (appel HTTP par exemple) et vous risquez d\'avoir beaucoup des valuers - on ne veut pas lancer 20 requêtes HTTP au même instant</li>' +
              '</ul>'
          }
        }
      },
      source: `
// Imaginons qu\\'on veut récupérer les détails de trois utilisateurs - pierre, paul et jack
// Il faudrait, pour chaque utilisateur, appeler un web service
// Du coup on fera 3 appels - ces appels peuvent soit "concataner" ensemble, soit "merger" ensemble 

var usernames = ['pierre', 'paul', 'jack'];

var concatMapExemple = of( ... usernames)
  .pipe(
    // Simule, pour l\'utilisateur en cours, une requête HTTP pour récupérer ses détails
    // Avec "_pause()" on simule un blocage dans le pipeline - cette "inner observable" sera bloqué jusqu'a vous clicker sur le bouton
    concatMap(username => this.httpService.getDetailsForUser(username).pipe(_pause())))
  .subscribe();
  
var mergeMapExemple = of( ... usernames)
  .pipe(
    // Simule, pour l'utilisateur en cours, une requête HTTP pour récupérer ses détails
    // Avec "_pause()" on simule un blocage dans le pipeline - cette "inner observable" sera bloqué jusqu'a vous clicker sur le bouton
    mergeMap(username => this.httpService.getDetailsForUser(username).pipe(_pause())))
  .subscribe();

`
    });
  }

  private addTemplate(template: PipelineTemplate): void {
    assert(template, 'template');
    this.templates.push(template);
  }

  private basicSampleHttpService(): string {
    return `
    this.httpService = (() => {
      
      var users = {
        pierre: {username: 'pierre', email: 'pierre@test.com', name: 'Pierre Peterson'},
        paul: {username: 'paul', email: 'paul@test.com', name: 'Paul Paulson'},
        jack: {username: 'jack', email: 'jack@test.com', name: 'Jack Jackson'}
      };
      
      function getDetailsForUser(username) {
        console.log(\`Retrieving details for: \${username}\`);
        if (!users[username]) {
          return throwError(\`User not found: \${username}\`);
        } 
        
        var result = of(users[username]);
        result.setArgsText(\`this.httpService.getDetailsForUser('\${username}')\`);
        return result;
      }
      
      return {
        getCurrentUser: () => of(users['pierre']),
        getNonExistentUser: (username) => throwError(\`User not found: username\`),
        getDetailsForUser
      };
    })();`;
  }
}
