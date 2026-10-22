const fs = require('fs');
let code = fs.readFileSync('src/components/CommentsSection.tsx', 'utf-8');

code = code.replace(
`                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
        );
          })
        )}`,
`                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
          })
        )}`
);

fs.writeFileSync('src/components/CommentsSection.tsx', code);
