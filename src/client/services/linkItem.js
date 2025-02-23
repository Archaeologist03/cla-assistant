'use strict';

module.factory('linkItemService', ['$RPCService',
    function ($RPCService) {
        function createNewItem(item, options, type) {
            if (!type) {
                type = options;
                options = item;
            }
            const newItem = {
                gist: options.gist.url,
                sharedGist: options.sharedGist,
                whiteListPattern: options.whiteListPattern,
                minFileChanges: options.minFileChanges,
                minCodeChanges: options.minCodeChanges,
                privacyPolicy: options.privacyPolicy
            };
            if (type === 'repo') {
                newItem.repoId = item.repoId || item.id;
                newItem.repo = item.repo || item.name;
                newItem.owner = item.owner.login || item.owner;
            } else {
                newItem.orgId = item.orgId || item.id;
                newItem.org = item.org || item.login;
                newItem.excludePattern = options.excludePattern;
            }

            return newItem;
        }

        return {
            createLink: (item, options) => {
                const type = item.full_name ? 'repo' : 'org';
                const newItem = createNewItem(item, options, type);

                return $RPCService.call(type, 'create', newItem);
            },

            updateLink: (item) => {
                const type = item.repoId ? 'repo' : 'org';
                const newItem = createNewItem(item, type);

                return $RPCService.call(type, 'update', newItem);
            }
        };
    }
]);