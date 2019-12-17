import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";


@Entity("rolemapping" ,{schema:"public" } )
export class rolemapping {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:true,
        length:1024,
        name:"principaltype"
        })
    principaltype:string | null;
        

    @Column("character varying",{ 
        nullable:true,
        length:1024,
        name:"principalid"
        })
    principalid:string | null;
        

    @Column("integer",{ 
        nullable:true,
        name:"roleid"
        })
    roleid:number | null;
        
}
