import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {projectreporting} from "./projectreporting";


@Entity("storage" ,{schema:"public" } )
@Index("storage_objectid_key",["objectid",],{unique:true})
export class storage {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("text",{ 
        nullable:false,
        name:"container"
        })
    container:string;
        

    @Column("text",{ 
        nullable:false,
        name:"filename"
        })
    filename:string;
        

    @Column("text",{ 
        nullable:true,
        name:"mimetype"
        })
    mimetype:string | null;
        

    @Column("integer",{ 
        nullable:false,
        unique: true,
        name:"objectid"
        })
    objectid:number;
        

   
    @OneToMany(()=>projectreporting, (projectreporting: projectreporting)=>projectreporting.image,{ onDelete: 'CASCADE' , })
    projectreportings:projectreporting[];
    
}
