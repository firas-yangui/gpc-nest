import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";


@Entity("role" ,{schema:"public" } )
export class role {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:false,
        length:1024,
        name:"name"
        })
    name:string;
        

    @Column("character varying",{ 
        nullable:true,
        length:1024,
        name:"description"
        })
    description:string | null;
        

    @Column("timestamp with time zone",{ 
        nullable:true,
        name:"created"
        })
    created:Date | null;
        

    @Column("timestamp with time zone",{ 
        nullable:true,
        name:"modified"
        })
    modified:Date | null;
        
}
