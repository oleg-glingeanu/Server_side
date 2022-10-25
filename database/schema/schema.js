const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLID, 
    GraphQLSchema, 
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType,} = require('graphql');

//Mongoose Models
const Project = require('../models/Project');
const Client = require('../models/Client');


// Client Type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      phone: { type: GraphQLString },
    }),
});



// Projects Tyep
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: {type: GraphQLID},
        client: { 
            type: ClientType, 
            resolve(parent, args){
                return Client.findById(parent.clientId)
            }},
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString }
    })
})



const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

        // Clients GET request to get 1 or more clients
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args){
                return Client.find()
            }
        },

        client: {
            type:ClientType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                return Client.findById(args.id)
            }
        },


        // Projects GET request to get 1 or more projects
        projects:{
            type: new GraphQLList(ProjectType),
            resolve(parent, args){
                return Project.find();
            }
        },

        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID}},
            resolve(parent, args){
                return Project.findById(args.id)
            }
        }
    }
})

// Data Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{

        // Client Mutations
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args){
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });
                return client.save();
            }
        },
        deleteClient: {
            type: ClientType,
            args:{
                id: { type: GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args){
                return Client.findByIdAndDelete(args.id)
            }
        },


        // Project Mutations
        // Add a project using GraphQL
        addProject: {
            type: ProjectType,
            args : {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: { type: new GraphQLEnumType ({
                    name: 'ProjectStatus',
                    values: {
                        'new': {value: "Not Started"},
                        'progress': {value: "In Progress"},
                        'completed': {value: "Completed"},
                    }
                }),
                defaultValue: 'Not Started',
            },
            clientId : { type: GraphQLNonNull(GraphQLID)},
        },
        resolve(parent, args){
            const project = new Project({
                name: args.name,
                description: args.description,
                status: args.status,
                clientId: args.clientId
            });
            return project.save();
            }
        },

        // Delete a project using GraphQL
        deleteProject: {
            type: ProjectType,
            args: {
                projectId: { type: GraphQLID}
            },
            resolve(parent, args){
                return Project.findByIdAndRemove(args.projectId);
            }
        },

        // Update a project using GraphQL
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: {type: GraphQLString},
                description: { type: GraphQLString},
                status: {
                    type: new GraphQLEnumType( {
                        name: 'ProjectStatusUpdate',
                        values: {
                            new: { value: 'Not Started'},
                            progress: { value: 'In Progress'},
                            completed: { value: 'Completed'},
                        }
                    })
                }
            },
            resolve(parent, args){
                return Project.findByIdAndUpdate(
                    args.id, {
                        $set: {
                            name: args.name,
                            description: args.description,
                            status: args.status
                        }
                    },
                    {new: true}
                )
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})