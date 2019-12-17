import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";


@Entity("standalonemode" ,{schema:"public" } )
export class standalonemode {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("boolean",{ 
        nullable:true,
        name:"ison"
        })
    ison:boolean | null;
        
}
